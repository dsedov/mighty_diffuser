from datetime import datetime
import threading, queue
class RenderNode():
    ip_address = "0.0.0.0"
    port_address = "0"
    def __init__(self, ip, port):
        self.ip_address = ip
        self.port_address = port 


class RenderNodeManager():
    nodes = {}
    lock = threading.Lock()

    def __init__(self):
        print("- Starting Render Node Manager")
    def print_node_status(self):
        for k in self.nodes.keys():
            node_busy = self.nodes[k]['busy']
            node_alive = datetime.now() - self.nodes[k]['last_ping']
            node_name = self.nodes[k]['node_address']
            print(f"{'B' if node_busy else 'F'} - {node_name} - {node_alive}")


    def register_node(self, node_address, node_gpu):
        self.lock.acquire()
        self.nodes[node_address] = {
            'node_address' : node_address,
            'node_gpu' : node_gpu,
            'last_ping' : datetime.now(),
            'busy' : False,
        }
        self.print_node_status()
        self.lock.release()

    def submit_render_job(self, job):
        print("Received job")
            
    def ping_node(self, node_address, node_gpu):
        self.lock.acquire()
        if node_address in self.nodes.keys():
            self.nodes[node_address]['last_ping'] = datetime.now()
        else:
            self.nodes[node_address] = {
                'node_address' : node_address,
                'node_gpu' : node_gpu,
                'last_ping' : datetime.now(),
                'busy' : False,
            }
        self.print_node_status()
        self.lock.release()

    def start(self):
        threading.Thread(target=self.node_ping, daemon=True).start()    