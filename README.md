# 자료처리
## 데이터베이스 생성
```shell
# 
# su - postgres
postgres@c692d3e6197c:~$ psql
psql (14.11 (Ubuntu 14.11-0ubuntu0.22.04.1))
Type "help" for help.

postgres=# create database incpark owner scott;
CREATE DATABASE
postgres=# exit
postgres@c692d3e6197c:~$ exit
logout
# su - scott
scott@c692d3e6197c:~$ psql -U scott -d incpark
psql (14.11 (Ubuntu 14.11-0ubuntu0.22.04.1))
Type "help" for help.

incpark=# create extension postgis;
CREATE EXTENSION
```

## QGIS에서 처리
