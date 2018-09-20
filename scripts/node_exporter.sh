#!/usr/bin/env bash

echo

do_stop() {
    status=`ps -ef |grep -v grep|grep -v node_exporter.sh|grep "node_exporter/node_exporter"|wc -l`
    if [ $status -ne 0 ]
    then
        pid=`ps -ef |grep -v grep|grep -v node_exporter.sh|grep "node_exporter/node_exporter"|awk '{print $2}'`
        kill $pid
    fi
    sleep 2
    echo "stoping $0"
}

do_start() {
    path="run-tools/node_exporter"
    mkdir -p ${path}/log
    nohup ./${path}/node_exporter >${path}/log/out.file 2>&1 &
    echo "starting $0"
}

[ $# -ne 1 ]&&{
echo "usage:$0 {start|stop|restart|status}"
exit 1
}
#分支
case $1 in
start)
do_start
;;
stop)
do_stop
;;
restart)
do_stop
do_start
echo "restarted $0"
;;
status)
status=`ps -ef |grep -v grep|grep -v node_exporter.sh|grep "node_exporter/node_exporter"|wc -l`
[ $status -ne 0 ] && echo "status of $0 is running" || echo "status of $0 is stoped"
;;
*)
echo "usage:$0 {start|stop|restart|status}"
;;
esac
