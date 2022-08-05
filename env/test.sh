#!/bin/bash

value=`cat result.txt`
readarray -d ';' -t strarr <<<"$value"
error=${strarr[1]}
if (($error > 0)); then
    echo "测试失败"
    echo '::set-output name=success::false'
  else
    echo "测试成功"
    echo '::set-output name=success::true'
fi