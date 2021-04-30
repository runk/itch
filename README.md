# Nasdaq ITCH data feed parser and tools

## Data

Sample data is availabe for free download from ftp://emi.nasdaq.com/ITCH/

## Command line tool

Features:

- Repackaging the bigger data file into smaller sets
- Filter by message type
- Filter by locate
- Limit output to N messages
- Raw and json output formats

### Basic usage

To get first 100 messages of locate 13 (AAPL - Apple) in json format:

```shell
npx itch.js -f ~/Downloads/01302020.NASDAQ_ITCH50 -n 100 -l 13
```

```
Usage: itch [options]

Options:
  -V, --version          output the version number
  -f, --file <string>    Input file with ITCH data feed
  -t, --type <string>    Filter by a specific message type, e.g. "R" or "A"
  -b, --binary           Raw data (binary) output
  -l, --locate <number>  Filter by a specific locate
  -n, --head <number>    Number of output messages
  -h, --help             display help for command
```

## Reference

https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf
