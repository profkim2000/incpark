# 자료처리
## 데이터베이스 생성
```shell
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

## CSV 파일 처리
한글 컬럼명을 영어로 변경

![image](https://github.com/profkim2000/incpark/assets/162937223/feb64ec4-b7bd-485c-beaf-97272eb71c14)


## QGIS에서 처리
csv 파일 가져오기

![image](https://github.com/profkim2000/incpark/assets/162937223/3cee8446-bc2b-4166-9ea8-5e2f9cbad152)

postgis로 보내기

![image](https://github.com/profkim2000/incpark/assets/162937223/466e3304-e9fb-4355-8888-4cf4ebfedf6b)

## geoServer
### 작업공간: incpark
### 저장소
- host: 172.30.0.7 (docker 내에서 자기들끼리의 ip)
- port: 5432
- database: incpark
- schema: public
- user: scott / tiger
  
![image](https://github.com/profkim2000/incpark/assets/162937223/a2b92ea0-9630-4928-9bfd-d9c8c2423842)

