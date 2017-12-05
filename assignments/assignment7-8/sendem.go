// 
// 
// Copyright (c) 2017 stephen.farrell@cs.tcd.ie
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

package main

import (
	"net/http"
	"os"
	"io/ioutil"
	"fmt"
	"time"
	"math/big"
	"strings"
	"strconv"
)

func MakeRequest(vanity string, url string, ch chan<-string) {
	var err error
	var lv=vanity[2:]
	start := time.Now()
	resp, err := http.Get(url)
	if (err!=nil) {
		ch <- fmt.Sprintf("Error: %s\n",err)
		return
	}
	secs := time.Since(start).Seconds()
	body, err := ioutil.ReadAll(resp.Body)
	if (err!=nil) {
		ch <- fmt.Sprintf("Error: %s\n",err)
		return
	}
	// check lv is start of body
	if !strings.EqualFold(lv,string(body[0:len(lv)])) {
		ch <- fmt.Sprintf("Error: missing vanity string from prime")
		return
	}
	var p big.Int
	p.SetString(string(body),16)
	var res string
	//fmt.Printf("P: %s\n",p.Text(16))
	if p.ProbablyPrime(20) && p.BitLen() == 1024 {
		res="Nice prime"
	} else {
		res="Bummer - not a nice prime"
	}
	ch <- fmt.Sprintf("%.2f elapsed, %s from %s with response length: %d %s", secs, res, url, len(body), body)
}

func usage (prog string) {
	fmt.Fprintf(os.Stderr,"usage: %s [-p port]\n",prog)
}

func main() {
	var err error
	la:=len(os.Args)
	if (la != 1 && la != 3 ) {
		usage(os.Args[0]);
		return
	}
	var portstr=":8081"
	if (la == 3) {
		if (os.Args[1]!="-p") {
			fmt.Fprintf(os.Stderr,"bad argument number: %s\n",err)
			usage(os.Args[0])
			return
		}
		port,err := strconv.Atoi(os.Args[2])
		if (err!=nil) {
			fmt.Fprintf(os.Stderr,"bad port number: %s\n",err)
			usage(os.Args[0])
			return
		}
		if (port <0 || port > 65535 ) {
			fmt.Fprintf(os.Stderr,"bad port number: %d\n",port)
			usage(os.Args[0])
			return
		}
		if port == 80 {
			portstr=fmt.Sprintf("")
		} else {
			portstr=fmt.Sprintf(":%d",port)
		}
	}
	var url=fmt.Sprintf("http://127.0.0.1%s/.well-known/vanityprime?vs=",portstr)
	var vanities = []string{"0xdeadbeef","0xbeadfeed","0xabcdef01"}
	start := time.Now()
	ch := make(chan string)
	for _,vanity := range vanities {
		//fmt.Printf("Vanity: %s\n",vanity)
		go MakeRequest(vanity,url+vanity, ch)
	}
	for range vanities{
		fmt.Println(<-ch)
	}
	fmt.Printf("%.2fs elapsed\n", time.Since(start).Seconds())
}
