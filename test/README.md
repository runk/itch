# Test data

```shell
./bin/itch -f ~/Downloads/01302020.NASDAQ_ITCH50 -l 13 -b > ./locate-13.bin
./bin/itch -f locate-13.bin -b -n 10000 > test/locate-13-10k.bin
```
