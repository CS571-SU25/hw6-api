build
```bash
docker build . -t ctnelson1997/cs571-su25-hw6-api
docker push ctnelson1997/cs571-su25-hw6-api
```

run
```bash
docker pull ctnelson1997/cs571-su25-hw6-api
docker run --name=cs571_su25_hw6_api -d --restart=always -p 38106:38106 -v /cs571/su25/hw6:/cs571 ctnelson1997/cs571-su25-hw6-api
```
