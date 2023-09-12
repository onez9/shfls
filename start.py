import re
import subprocess
import socket
import threading
import os
#import qrcode
import io
import logging
import webbrowser

import colorama


clear = lambda: os.system('clear')


def changeIP(name, ip):
    print(f'ip: {ip}')
    print(f'name: {name}')

    with io.open(name, 'r', buffering=5) as file:
        # txt = file.read()
        txt=file.read()
        res = re.findall(r'(\d+.\d+.\d+.\d+|localhost)', txt)
        for element in res:
            txt=txt.replace(element, ip)

    with io.open(name, 'w') as fo:
        fo.write(txt)



if __name__=='__main__':
    logging.basicConfig(level=logging.INFO)
    # path_config='./Configs/config.mjs'
    print('Начинаю запуск')
    os.chdir(os.path.dirname(__file__))
    try:
        #host=socket.gethostname()+'.org'
        #host = socket.gethostname()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            print('Запуск в локальной сети')
            sock.connect(('1.1.1.1', 1234))
            ip,port=sock.getsockname()

        except OSError:
            print('Запуск на локалхост')
            ip='127.0.0.1'

        #local_ip, local_port = sock.getsockname()
        #print(host)
        #ip,port=socket.gethostbyname(host)
        #print(ip)

        # ip='0.0.0.0'
        #ip='192.168.1.9'


        #print('hello')
        #ip='192.168.160.184'

        print(f'ip: {ip}')

        changeIP('src/server/configs/config.mjs', ip)
        changeIP('index.html', ip)
        changeIP('src/views/files.vue', ip)

        # changeIP('src/views/chat.vue', ip)
        changeIP('.env', ip)



        def f1():
            subprocess.call(['npm', 'start'])
        def f2():
            subprocess.call(['npm', 'run', 'dev'])

        t1=threading.Thread(target=f1)
        t2=threading.Thread(target=f2)

        t1.start()
        t2.start()
        # webbrowser.get('chromium').open(f'http://{ip}:3000')
        print(f'http://{ip}:3000')

        #url = f'http://{ip}:3000'
        #print(url)
        #qr = qrcode.QRCode()

        #qr.add_data(url)
        #f = io.StringIO()
        #qr.print_ascii(out=f)

        #f.seek(0)
        #print(f.read())
        
    except KeyboardInterrupt:
        print('Завершаю работу программы')
