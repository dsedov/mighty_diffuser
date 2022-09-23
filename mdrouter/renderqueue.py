import uuid
import threading, queue
class RenderQueueItem():
    def __init__(self, prompt, settings):
        self.prompt = prompt
        self.saved = False
        self.settings = settings 
        self.images = []
        self.id = str(uuid.uuid4())

class RenderQueue():
    def __init__(self):
        print("- Starting Render Queue") 
        self.finished_jobs = {}
        self.queue = queue.Queue()
        self.lock = lock = threading.Lock()
    def post_job(self, job):
        print("RQ: Received mew job")
        self.queue.put(job)
    def grab_job(self):
        return self.queue.get()
    def loop(self):
        print("RQ: Render server started")
        while(1):
            job = self.grab_job()
            print("RQ: Loaded job")
            job.images = generate(job.settings, f"{job.prompt}", global_model) 
            print(f"RQ: Rendered {len(job.images)} images")
            self.lock.acquire()
            self.finished_jobs[job.id] = job
            self.lock.release()
            print("RQ: Processed job")
    def get_job(self, id):
        self.lock.acquire()
        job = None
        if id in self.finished_jobs.keys():
            job = self.finished_jobs[id]
        self.lock.release()
        return job
    def start(self):
        threading.Thread(target=self.loop, daemon=True).start()
