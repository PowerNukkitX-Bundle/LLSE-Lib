#!/bin/bash
#resource link | https://res.nullatom.com

mkdir -p PowerNukkitX
cd PowerNukkitX

linux_type=`uname -a`;
pnx_cli_filename='PNX-CLI-Jar.zip';
if [[ $linux_type =~ x86_64 ]]; then
  pnx_cli_filename='PNX-CLI-Linux-x86.zip'
elif [[ $linux_type =~ aarch64 ]]; then
  pnx_cli_filename='PNX-CLI-Linux-arm.zip'
else
  echo "不受支持的指令集！"
  echo $linux_type
  exit 3
fi

rm ./$pnx_cli_filename;
if [[ ! -f "./pnx" ]]; then
  echo "pnx启动器不存在，尝试下载..."
  if [[ ! -f "./$pnx_cli_filename" ]]; then
    curl https://res.nullatom.com/file/pnx/cli/$pnx_cli_filename -o $pnx_cli_filename -L
  fi
  echo "正在解压zip..."
  unzip -j $pnx_cli_filename
  # 上一条命令是否执行失败
  if [ $? -ne 0 ]; then
    echo "unzip failed!"
    echo "解压失败，请手动解压 $pnx_cli_filename 文件！"
    exit 1;
  else
    echo "unzip success!"
  fi
  echo "启动器下载完成，正在启动pnx..."
fi
chmod 777 pnx
 
server_files=`ls ./PowerNukkitX*.jar | grep -i '.jar' | wc -l`
if [[  $server_files == "0" ]]; then #判断文件是否存在
  echo "pnx服务端不存在"
  ./pnx server install --latest
fi

if [[ ! -d "./libs" ]]; then #判断文件夹是否存在
  echo "缺少libs文件夹"
  ./pnx libs -u
fi

libs_files=`ls ./libs | grep -i '.jar' | wc -l`;
while [[ `expr $libs_files + 0` -lt 42 ]]
do
    echo "libs缺失一半，将重新下载"
    rm -rf ./libs
    ./pnx libs -u
done

if [[ `expr $libs_files + 0` -lt 84 ]]; then
  echo "libs似乎有缺失，建议删除libs文件夹并重新启动"
fi