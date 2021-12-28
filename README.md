# a-blog

a nodejs express jsonDB blog

---

## How 2 setup

1. clone this repo
```bash
git clone https://github.com/Eds-trash-can/a-blog.git
```

2. go into dir
```bash
cd a-blog
```

3. configure
```bash
cp config/config.example.yaml config/config.yaml
nano config/config.yaml
```

4. create storage files
```bash
touch storage/posts.json
touch storage/comments.json
```

5. start up
```bash
node node/app
```
