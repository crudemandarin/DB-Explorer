DROP DATABASE pms;
 
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
    UpdatedBy varchar(64) NOT NULL
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
 
ALTER TABLE Workspace ADD FOREIGN KEY (CreatedBy) REFERENCES WorkspaceUser(ID);
ALTER TABLE Workspace ADD FOREIGN KEY (UpdatedBy) REFERENCES WorkspaceUser(ID);
ALTER TABLE WorkspaceUser ADD FOREIGN KEY (DepartmentID) REFERENCES Department(ID);
 
CREATE TABLE Project (
    ID varchar(64) NOT NULL PRIMARY KEY,
    WorkspaceID varchar(64) NOT NULL,
    CreatedAt bigint NOT NULL,
    CreatedBy varchar(64) NOT NULL,
    LastUpdated bigint NOT NULL,
    UpdatedBy varchar(64) NOT NULL,
    Title varchar(128) NOT NULL,
    Budget float,
    Effort float,
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID),
    FOREIGN KEY (CreatedBy) REFERENCES WorkspaceUser(ID),
    FOREIGN KEY (UpdatedBy) REFERENCES WorkspaceUser(ID)
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
    `Status` smallint, -- Stores status
    Effort float,
    Cost float,
    EffortActual float,
    CostActual float,
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
    FOREIGN KEY (TaskID) REFERENCES Task(ID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ID),
    FOREIGN KEY (WorkspaceID) REFERENCES Workspace(ID)
) ENGINE=INNODB;
 
CREATE TABLE WorkspaceUserProjectRelation (
    WorkspaceUserID varchar(64) NOT NULL,
    ProjectID varchar(64) NOT NULL,
    FOREIGN KEY (WorkspaceUserID) REFERENCES WorkspaceUser(ID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ID)
) ENGINE=INNODB;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

SHOW TABLES;