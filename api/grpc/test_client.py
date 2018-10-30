from __future__ import print_function

import grpc

from api.grpc.helloworld import helloworld_pb2_grpc, helloworld_pb2


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    #
    # For more channel options, please see https://grpc.io/grpc/core/group__grpc__arg__keys.html
    with grpc.insecure_channel(
            target='localhost:50051',
            options=[('grpc.lb_policy_name', 'pick_first'),
                     ('grpc.enable_retries', 0), ('grpc.keepalive_timeout_ms',
                                                  10000)]) as channel:
        stub = helloworld_pb2_grpc.GreeterStub(channel)
        # Timeout in seconds.
        # Please refer gRPC Python documents for more detail. https://grpc.io/grpc/python/grpc.html
        response = stub.SayHello(helloworld_pb2.HelloRequest(name='Three'), timeout=10)
    print("Greeter client received: " + response.message)


def test_run():
    run()


if __name__ == '__main__':
    run()
