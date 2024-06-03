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
- user: scott
- passwd: tiger
- Expose primary keys에 체크(중요. 이래야 ID를 사용할 수 있다)

![image](https://github.com/profkim2000/incpark/assets/162937223/69ac72e3-369d-413a-8934-6ec8559610dc)


### 레이어
- 대상 테이블: parks
- 레이어 이름: parks

<br><br>

# Openlayers

## Openlayers 앱 생성
```shell
PS D:\webmap03> npm create ol-app incpark

added 31 packages, and audited 32 packages in 3s

6 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS D:\webmap03> cd incpark
PS D:\webmap03\incpark> npm start

> incpark@1.0.0 start
> vite


  VITE v5.2.11  ready in 251 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Openlayers 앱 build
만약 현재 npm start로 실행 중이면, ctrl + C 를 눌러 중지시키고 아래와 같이 실행

```shell
Terminate batch job (Y/N)? y
PS D:\github_profkim2000\incpark2024\source\incpark> npm run build

> incpark@1.0.0 build
> vite build

vite v5.2.11 building for production...
✓ 325 modules transformed.
dist/index.html                   0.66 kB │ gzip:  0.41 kB
dist/assets/index-ByE2kg69.css    5.49 kB │ gzip:  1.44 kB
dist/assets/index-B08Ehlbk.js   339.80 kB │ gzip: 98.18 kB │ map: 2,072.76 kB
✓ built in 2.60s
PS D:\github_profkim2000\incpark2024\source\incpark>
