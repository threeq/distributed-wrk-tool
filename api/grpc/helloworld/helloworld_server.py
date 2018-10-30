from api.grpc.helloworld import helloworld_pb2_grpc, helloworld_pb2


class Greeter(helloworld_pb2_grpc.GreeterServicer):

    def SayHello(self, request, context):
        print("recive message: %s" % request.name)
        return helloworld_pb2.HelloReply(message='Hello, %s!' % request.name)
