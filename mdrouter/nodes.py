class RenderNode():
    ip_address = "0.0.0.0"
    port_address = "0"
    def __init__(self, ip, port):
        self.ip_address = ip
        self.port_address = port 


class RenderNodeManager():
    nodes = []
    def __init__(self):
        print("- Starting Render Node Manager")