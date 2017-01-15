# QNAP CLI Utility
[![NPM Version](https://img.shields.io/npm/v/qnapcli.svg)](https://www.npmjs.com/package/qnapcli)

This utility allows you send command to your QNAP.

## Installation

Install this CLI globally:

```
[sudo] npm install -g qnapcli
```

## Features

 - Allows the QNAP to beep.

## Usage

`qnapcli` is mostly self documenting. After installation, run the `qnapcli --help` command from your command line.

   **Usage:**
   
    qnapcli <command> [options]

   **Options:**

    --protocol         the protocol to use, default is https
    --host             the host to use, required
    --port             the port to use, default is 443
    --username         the user to authenticate as, required
    --password         the user's password, required
    --count            how many times you want beep? Default is 1
    --interval         how much time in milliseconds from one beep to another? Default is 1000
    --strictssl        if 1, requires SSL certificates be valid, default is 1
    --timeout          timeout in milliseconds for request, default is 5000
    
   **Some Examples:**

    qnapcli beep --host=192.168.0.100 --username=admin --password=password --strictssl=0 --protocol=http --port=8080
    qnapcli beep --host=192.168.0.100 --username=admin --password=password --count=4
    qnapcli beep --host=username.myqnapcloud.com --username=admin --password=password
