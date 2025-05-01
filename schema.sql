-- create database if not exists quora;
-- use database quora;

create table if not exists posts ( id varchar(50) primary key not null unique,
 username varchar(20) not null,
 content varchar(50) );

insert into posts values
("1a","ram","hii"),
("2b","shyam","hello"),
("3c","raghav","whats upp");