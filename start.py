import re
import subprocess
import socket
import threading
import os
#import qrcode
import io
import logging
import webbrowser



clear = lambda: os.system('clear')

if __name__=='__main__':
    logging.basicConfig(level=logging.INFO)
    path_config='./Configs/config.mjs'
    print('Начинаю запуск')
    os.chdir(os.path.dirname(__file__))
    try:
        host=socket.gethostname()
        ip=socket.gethostbyname(host)
        # ip='0.0.0.0'

        print(f'ip: {ip}')
        with open(path_config, 'r') as fi:
            txt=fi.read()
            result = re.findall(r'\d+.\d+.\d+.\d+', txt)

            print(result)
            with open(path_config, 'w') as fo:
                for item in result:
                    txt = txt.replace(item, ip)
                    fo.write(txt)
        
        file = io.open('index.html', 'r', buffering=5)
        # txt = file.read()
        txt=file.read()
        res = re.findall(r'\d+.\d+.\d+.\d+', txt)
        for element in res:
            txt=txt.replace(element, ip)

        file.close()

        with io.open('index.html', 'w') as fo:
            fo.write(txt)

        path_file = 'src/views/videos.vue'
        file = io.open(path_file, mode='r')
        text=file.read()
        res = re.findall(r'\d+.\d+.\d+.\d+', text)
        for element in res:
            text=text.replace(element, ip)
        file.close()

        with io.open(path_file, mode='w') as fo:
            fo.write(text)

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
