DROP DATABASE PMS;

CREATE DATABASE PMS;

USE PMS;

CREATE TABLE `User` ( 
    ID varchar(64) NOT NULL PRIMARY KEY, 
    FirstName varchar(64) NOT NULL,
    LastName varchar(64) NOT NULL,
    Email varchar(128)
) ENGINE=INNODB;

CREATE TABLE Workspace (
    ID varchar(64) NOT NULL PRIMARY KEY,
    CreatedAt bigint NOT NULL,
    CreatedBy varchar(64) NOT NULL,
    LastUpdated bigint NOT NULL,
    UpdatedBy varchar(64) NOT NULL,
    FOREIGN KEY (CreatedBy) REFERENCES User(ID),
    FOREIGN KEY (UpdatedBy) REFERENCES User(ID)
) ENGINE=INNODB;

CREATE TABLE UserWorkspaceRelation (
    UserID varchar(64) NOT NULL, 
    WorkspaceID varchar(64) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES `User`(ID),
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID)
) ENGINE=INNODB;

CREATE TABLE WorkspaceUser (
    ID varchar(64) NOT NULL PRIMARY KEY,
    UserID varchar(64) NOT NULL,
    `Role` smallint NOT NULL,
    WorkspaceID varchar(64) NOT NULL,
    DepartmentID varchar(64),
    FOREIGN KEY (UserID) REFERENCES `User`(ID),
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID)
) ENGINE=INNODB;

CREATE TABLE Department (
    ID varchar(64) NOT NULL PRIMARY KEY,
    WorkspaceID varchar(64) NOT NULL,
    CreatedAt bigint NOT NULL,
    CreatedBy varchar(64) NOT NULL,
    LastUpdated bigint NOT NULL,
    UpdatedBy varchar(64) NOT NULL,
    Title varchar(128) NOT NULL,
    `Description` varchar(512),
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID),
    FOREIGN KEY (CreatedBy) REFERENCES WorkspaceUser(ID),
    FOREIGN KEY (UpdatedBy) REFERENCES WorkspaceUser(ID)
) ENGINE=INNODB;

ALTER TABLE WorkspaceUser ADD FOREIGN KEY (DepartmentID) REFERENCES Department(ID); 

/*Added TotalCost and TotalEffort fields to keep track of real cost and effort computed by a summation
	of the project's tasks' CostActual and EffortActual fields.
Triggers handle these calculations on update and insert of a Task at this time
Budget,Effort,TotalCost,TotalEffort fields now have a default value of 0.*/
CREATE TABLE Project (
    ID varchar(64) NOT NULL PRIMARY KEY,
    WorkspaceID varchar(64) NOT NULL,
    DepartmentID varchar(64),
    CreatedAt bigint NOT NULL,
    CreatedBy varchar(64) NOT NULL,
    LastUpdated bigint NOT NULL,
    UpdatedBy varchar(64) NOT NULL,
    Title varchar(128) NOT NULL,
    EstimatedCost float,
    EstimatedEffort float,
    ActualCost float DEFAULT 0,
    ActualEffort float DEFAULT 0,
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID),
    FOREIGN KEY (DepartmentID) REFERENCES Department(ID),
    FOREIGN KEY (CreatedBy) REFERENCES WorkspaceUser(ID),
    FOREIGN KEY (UpdatedBy) REFERENCES WorkspaceUser(ID)
) ENGINE=INNODB;

CREATE TABLE WorkspaceUserProjectRelation (
    WorkspaceUserID varchar(64) NOT NULL,
    ProjectID varchar(64) NOT NULL,
    FOREIGN KEY (WorkspaceUserID) REFERENCES WorkspaceUser(ID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ID)
) ENGINE=INNODB;

CREATE TABLE Task (
    ID varchar(64) NOT NULL PRIMARY KEY,
    ProjectID varchar(64) NOT NULL,
    WorkspaceID varchar(64) NOT NULL,
    ParentTaskID varchar(64),
    CreatedAt bigint NOT NULL,
    CreatedBy varchar(64) NOT NULL,
    LastUpdated bigint NOT NULL,
    UpdatedBy varchar(64) NOT NULL,
    Title varchar(128) NOT NULL,
    `Description` varchar(512),
    `Status` smallint,
    EstimatedCost float,
    EstimatedEffort float,
    ActualCost float DEFAULT 0,
    ActualEffort float DEFAULT 0,
    StartDate bigint,
    DueDate bigint,
    TaskStarted bigint,
    TaskEnded bigint,
    FOREIGN KEY (ProjectID) REFERENCES Project(ID),
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID),
    FOREIGN KEY (ParentTaskID) REFERENCES Task(ID),
    FOREIGN KEY (CreatedBy) REFERENCES WorkspaceUser(ID),
    FOREIGN KEY (UpdatedBy) REFERENCES WorkspaceUser(ID)
) ENGINE=INNODB;

CREATE TABLE Tag (
    ID varchar(64) NOT NULL PRIMARY KEY,
    WorkspaceID varchar(64) NOT NULL,
    ProjectID varchar(64) NOT NULL,
    TaskID varchar(64),
    Message varchar(256),
    FOREIGN KEY (TaskID) REFERENCES Task(ID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ID),
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID)
) ENGINE=INNODB;

/*Triggers*/
/*Trigger activated on row insert on Task Table: updates project total cost*/
delimiter |
Create Trigger bef_insert_ProjCost_update BEFORE INSERT ON Task
	FOR EACH ROW
	BEGIN
		UPDATE Project SET Project.ActualCost = Project.ActualCost + (New.ActualCost) WHERE New.ProjectID = Project.ID;
	END;
|
delimiter ;

/*Trigger activated on row update of Task Table: updates project total cost*/
delimiter |
Create Trigger bef_update_ProjCost_update BEFORE UPDATE ON Task
	FOR EACH ROW
	BEGIN
		UPDATE Project SET Project.ActualCost = Project.ActualCost + (New.ActualCost-Old.ActualCost) WHERE New.ProjectID = Project.ID;
	END;
|
delimiter ;

/*Trigger activated on row insert on Task Table: updates project total effort*/
delimiter |
Create Trigger bef_insert_ProjEffort_insert BEFORE INSERT ON Task
	FOR EACH ROW
	BEGIN
		UPDATE Project SET Project.ActualEffort = Project.ActualEffort + (New.ActualEffort) WHERE New.ProjectID = Project.ID;
	END;
|
delimiter ;

/*Trigger activated on row update of Task Table: updates project total effort*/
delimiter |
Create Trigger bef_insert_ProjEffort_update BEFORE Update ON Task
	FOR EACH ROW
	BEGIN
		UPDATE Project SET Project.ActualEffort = Project.ActualEffort + (New.ActualEffort - Old.ActualEffort) WHERE New.ProjectID = Project.ID;
	END;
|
delimiter ;

show triggers;
show tables;