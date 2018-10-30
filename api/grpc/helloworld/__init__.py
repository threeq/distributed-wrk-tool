from api.grpc.helloworld import helloworld_pb2_grpc
from api.grpc.helloworld.helloworld_server import Greeter


def register(server):
    helloworld_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
