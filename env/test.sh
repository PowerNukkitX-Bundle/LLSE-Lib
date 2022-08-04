#!/bin/bash
suite="#"
summary="@"
cat result.txt | while read line; do
  first=${line:0:1}
  if [ $first = $suite ]; then
    str=${line:1}
    echo "测试套件$str"
  elif [ $first = $summary ]; then
    str=${first:1}
    array=(${str//;/ })   #以;分割字符串
    error=let ${array[1]} #转整型
    if (($error > 0)); then
      echo "测试失败"
      echo '::set-output name=success::false'
    else
      echo "测试成功"
      echo '::set-output name=success::true'
    fi
  else
    array=(${line//=/ }) #以=分割字符串
    isSuc=${array[1]}
    if [ $isSuc = "true" ]; then
      echo "${array[0]}测试成功"
    elif [ $isSuc = "false" ]; then
      echo "${array[0]}测试失败,失败信息${array[2]}"
    fi
  fi
done
