/*Inserting User test data to User table 45 total*/
INSERT INTO `User` (`ID`,`FirstName`,`LastName`,`Email`)
VALUES
  (01,"Lacey","Clayton","sed.molestie.sed@aol.couk"),
  (02,"Baxter","Greer","eu.sem@outlook.edu"),
  (03,"Caryn","Montoya","turpis.nulla@icloud.couk"),
  (04,"Porter","Rodriguez","porttitor.interdum@icloud.ca"),
  (05,"Blake","Joyce","tellus.non@google.ca"),
  (06,"Hall","Riggs","cubilia.curae@google.com"),
  (07,"Ezra","Mills","egestas@aol.net"),
  (08,"Nomlanga","Knapp","faucibus@hotmail.ca"),
  (09,"Maia","Clayton","dapibus@protonmail.edu"),
  (10,"Olga","Guy","tellus@hotmail.edu"),
  (11,"Clark","Pruitt","mauris.ut.mi@icloud.edu"),
  (12,"Shad","Hansen","consequat.auctor@google.net"),
  (13,"Patricia","Savage","volutpat.nulla.dignissim@google.com"),
  (14,"Mechelle","Warren","odio.auctor@aol.net"),
  (15,"Clayton","Beach","convallis.dolor@hotmail.edu"),
  (16,"Daryl","Munoz","mauris@outlook.edu"),
  (17,"Destiny","Carter","praesent.interdum@outlook.org"),
  (18,"Merritt","Petty","luctus.sit@yahoo.org"),
  (19,"Hashim","Ferguson","donec@protonmail.org"),
  (20,"Merrill","Lang","orci.tincidunt.adipiscing@outlook.couk"),
  (21,"Oren","Kelly","tempus.mauris@google.couk"),
  (22,"Holmes","Wilder","nulla.vulputate@icloud.net"),
  (23,"Todd","Tyler","amet@outlook.com"),
  (24,"Quyn","Yang","sem.ut@icloud.ca"),
  (25,"Isaac","Chase","interdum.ligula@yahoo.ca"),
  (26,"Fulton","Dorsey","sed.orci.lobortis@hotmail.couk"),
  (27,"April","Christensen","massa.mauris.vestibulum@aol.org"),
  (28,"Jolene","Lester","purus.gravida@icloud.ca"),
  (29,"Jolene","Leblanc","dolor.donec@outlook.ca"),
  (30,"Colin","Chambers","est@protonmail.com"),
  (31,"Peter","Sullivan","urna.ut@icloud.org"),
  (32,"Perry","Mueller","urna.ut.tincidunt@aol.org"),
  (33,"Alisa","Pate","auctor.odio.a@outlook.ca"),
  (34,"Haley","Solomon","lobortis@outlook.com"),
  (35,"Oliver","Buckner","ante.dictum.cursus@icloud.ca"),
  (36,"MacKenzie","Wagner","diam.lorem@hotmail.net"),
  (37,"Fallon","Mcfadden","nec@outlook.ca"),
  (38,"Zachary","Strong","eros.non@icloud.edu"),
  (39,"Joan","Delacruz","dignissim.lacus@yahoo.ca"),
  (40,"Warren","Ryan","fermentum.vel@hotmail.ca"),
  (41,"Thaddeus","Norris","risus.at@protonmail.couk"),
  (42,"Yen","Mcclain","mollis.phasellus.libero@hotmail.org"),
  (43,"Denton","Kinney","enim.condimentum@outlook.net"),
  (44,"Rhoda","Robertson","aliquet@aol.ca"),
  (45,"Imelda","Bryant","integer.vulputate@google.com");

/*Inserting workspace test data 3 total*/
Insert Into Workspace (ID,CreatedAt,CreatedBy,LastUpdated,UpdatedBy)
  VALUES
	(1, 20160428, 1, 20220322, 2),
    (2, 20160428, 16, 20220322, 17),
    (3, 20160428, 31, 20220322, 32);

/*Assigning users to workspaces*/
INSERT INTO UserWorkspaceRelation (UserID,WorkspaceID)
VALUES
  (1,1),
  (2,1),
  (3,1),
  (4,1),
  (4,2),
  (5,1),
  (5,2),
  (5,3),
  (6,1),
  (6,3),
  (7,1),
  (8,1),
  (9,1),
  (10,1),
  (11,1),
  (12,1),
  (13,1),
  (14,1),
  (15,1),
  (16,2),
  (17,2),
  (18,2),
  (19,2),
  (20,2),
  (21,2),
  (22,2),
  (23,2),
  (24,2),
  (25,2),
  (26,2),
  (27,2),
  (28,2),
  (29,2),
  (30,2),
  (31,3),
  (32,3),
  (33,3),
  (34,3),
  (35,3),
  (36,3),
  (37,3),
  (38,3),
  (39,3),
  (40,3),
  (41,3),
  (42,3),
  (43,3),
  (44,3),
  (45,3);

/*creatign workspaceUsers and giving them roles. All role 100. Note: roles
can be changed to job titles but I thought we could assign a job title to a number if needed*/
/*Roles: 0 Owner | 1 Admin | 2 User*/
Insert INTO WorkspaceUser(ID,UserID,Role,WorkspaceID)
VALUES
  (1,1,0,1),
  (2,2,1,1),
  (3,3,1,1),
  (4,4,1,1),
  (46,4,1,2),
  (5,5,2,1),
  (47,5,2,2),
  (48,5,2,3),
  (6,6,2,1),
  (49,6,2,3),
  (7,7,2,1),
  (8,8,2,1),
  (9,9,2,1),
  (10,10,2,1),
  (11,11,2,1),
  (12,12,2,1),
  (13,13,2,1),
  (14,14,2,1),
  (15,15,2,1),
  (16,16,0,2),
  (17,17,1,2),
  (18,18,1,2),
  (19,19,2,2),
  (20,20,2,2),
  (21,21,2,2),
  (22,22,2,2),
  (23,23,2,2),
  (24,24,2,2),
  (25,25,2,2),
  (26,26,2,2),
  (27,27,2,2),
  (28,28,2,2),
  (29,29,2,2),
  (30,30,2,2),
  (31,31,0,3),
  (32,32,1,3),
  (33,33,2,3),
  (34,34,2,3),
  (35,35,2,3),
  (36,36,2,3),
  (37,37,2,3),
  (38,38,2,3),
  (39,39,2,3),
  (40,40,2,3),
  (41,41,2,3),
  (42,42,2,3),
  (43,43,2,3),
  (44,44,2,3),
  (45,45,2,3);
/*Creating departments 3 for workspace 1 | 2 for workspace 2  | 2 for workspace 3*/
INSERT INTO Department (ID,WorkspaceID,CreatedAt,CreatedBy,LastUpdated,UpdatedBy,Title,Description)
VALUES
	(1,1,"2022-01-04 04:49:58",1,"2022-02-03 00:59:39",2,"Research","Lorem ipsum"),
    (2,1,"2022-01-04 04:49:58",1,"2022-01-21 19:15:07",3,"Finance","Lorem ipsum"),
    (3,1,"2022-01-04 04:49:58",1,"2022-02-07 03:21:47",4,"Marketing","Lorem ipsum"),
    (4,2,"2022-01-07 05:27:16",16,"2022-03-15 18:59:04",17,"Sales","Lorem ipsum"),
    (5,2,"2022-01-07 05:27:16",16,"2022-04-02 08:52:05",18,"Human Resources","Lorem ipsum"),
    (6,3,"2022-01-11 07:31:07",31,"2022-04-03 16:09:40",32,"Purchase","Lorem ipsum"),
    (7,3,"2022-01-11 07:31:07",31,"2022-04-06 19:25:39",33,"Operations","Lorem ipsum");
    
    /*Assigning workspace users to departments*/
	Update WorkspaceUser SET DepartmentID = 1
	WHERE UserID BETWEEN 1 AND 5;
	Update WorkspaceUser SET DepartmentID = 2
	WHERE UserID BETWEEN 6 AND 10;
	Update WorkspaceUser SET DepartmentID = 3
	WHERE UserID BETWEEN 11 AND 15;
	Update WorkspaceUser SET DepartmentID = 4
	WHERE UserID BETWEEN 16 AND 24;
	Update WorkspaceUser SET DepartmentID = 5
	WHERE UserID BETWEEN 25 AND 30;
	Update WorkspaceUser SET DepartmentID = 6
	WHERE UserID BETWEEN 31 AND 40;
	Update WorkspaceUser SET DepartmentID = 7
	WHERE UserID BETWEEN 41 AND 45;

/*Creating projects 3 for workspace 1 | 2 for workspace 2  | 2 for workspace 3*/
INSERT INTO Project (ID,WorkspaceID,CreatedAt,CreatedBy,LastUpdated,UpdatedBy,Title, EstimatedCost,EstimatedEffort)
Values 
	(1,1,"2022-01-04 04:49:58",1,"2022-01-16 11:47:35",2,"Project1",1000,40),
    (2,1,"2022-01-04 04:49:58",1,"2022-01-16 13:05:09",3,"Project2",2000,80),
    (3,1,"2022-01-04 04:49:58",4,"2022-01-16 23:39:23",4,"Project3",1500,35),
    (4,2,"2022-01-07 05:27:16",16,"2022-01-16 23:39:23",17,"Project4",1250,25),
    (5,2,"2022-01-07 05:27:16",16,"2022-01-21 19:15:07",18,"Project5",2500,45),
    (6,3,"2022-01-11 07:31:07",31,"2022-02-03 00:59:39",32,"Project6",10000,120),
    (7,3,"2022-01-11 07:31:07",31,"2022-02-07 03:21:47",33,"Project7",9000,90);

/*Loading workspace user IDs and Assigning workspace users to Projects*/
INSERT INTO WorkspaceUserProjectRelation (WorkspaceUserID,ProjectID)
VALUES
  (1,1),(2,1),(3,1),(4,1),(5,1),(6,2),(7,2),
  (8,2),(9,2),(10,2),(11,3),(12,3),(13,3),(14,3),(15,3),(16,4),(17,4),(18,4),(19,4),(20,4),(21,4),(22,4),(23,4),(24,4),(25,5),(26,5),
  (27,5),(28,5),(29,5),(30,5),(31,6),(32,6),(33,6),(34,6),(35,6),(36,6),(37,6),(38,6),(39,6),(40,6),(41,7),(42,7),(43,7),(44,7),(45,7),
  (46,4),(47,5),(48,6),(49,7);

/*Creating tasks: 2 tasks for project 2 and 1 each for the rest*/
INSERT INTO Task (ID,ProjectID,WorkspaceID,CreatedAt,CreatedBy,LastUpdated,UpdatedBy,Title)
VALUES
  (1,1,1,"2022-01-09 16:13:58",1,"2022-03-11 00:55:15",2,"Task1"),
  (2,2,1,"2022-01-09 16:13:58",1,"2022-03-08 00:34:14",2,"Task2"),
  (3,3,1,"2022-01-12 12:01:23",1,"2022-03-12 01:06:44",2,"Task3"),
  (4,4,2,"2022-01-12 12:01:23",16,"2022-03-12 08:07:34",17,"Task4"),
  (5,5,2,"2022-01-12 12:01:23",16,"2022-03-13 06:27:59",17,"Task5"),
  (6,6,3,"2022-01-15 02:11:05",31,"2022-03-24 06:03:29",32,"Task6"),
  (7,7,3,"2022-01-15 02:11:05",31,"2022-04-01 07:21:05",32,"Task7"),
  (8,2,1,"2022-02-05 21:08:51",1,"2022-04-07 01:45:02",2,"Task8");

/*Creating tags for projects. There are 3 tags per task*/
INSERT INTO Tag (ID, WorkspaceID, ProjectID, Message)
VALUES
  (1,1,1,"odio sagittis semper. Nam"),
  (2,1,1,"penatibus et magnis dis parturient"),
  (3,1,1,"diam eu"),
  (4,1,2,"ante"),
  (5,1,2,"Integer vulputate,"),
  (6,1,2,"Aliquam auctor,"),
  (7,1,3,"nec"),
  (8,1,3,"ornare. In"),
  (9,1,3,"Donec non"),
  (10,2,4,"nibh. Quisque nonummy ipsum non arcu."),
  (11,2,4,"lobortis"),
  (12,2,4,"Etiam vestibulum"),
  (13,2,5,"pede."),
  (14,2,5,"sed consequat auctor, nunc"),
  (15,2,5,"nec, imperdiet nec, leo. Morbi neque"),
  (16,3,6,"tincidunt vehicula risus. Nulla eget metus"),
  (17,3,6,"varius orci, in"),
  (18,3,6,"semper erat, in consectetuer"),
  (19,3,7,"vitae mauris sit amet lorem"),
  (20,3,7,"turpis vitae"),
  (21,3,7,"consequat enim diam");
  
/*Creating tags for tasks. All tasks have a tag. Task 8 has 2 tags*/
INSERT INTO Tag (ID, WorkspaceID, ProjectID, TaskID, Message)
VALUES
  (22,1,1,1,"penatibus et magnis dis parturient"),
  (23,1,2,2,"diam eu"),
  (24,1,3,3,"ante"),
  (25,2,4,4,"Integer vulputate,"),
  (26,2,5,5,"Aliquam auctor,"),
  (27,3,6,6,"nec"),
  (28,3,7,7,"ornare. In"),
  (29,1,2,8,"Donec non"),
  (30,1,2,8,"Lorem Ipsum");
