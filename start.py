import re
import subprocess
import socket
import threading
import os
import qrcode
import io





clear = lambda: os.system('clear')

if __name__=='__main__':
    print('Начинаю запуск')
    os.chdir(os.path.dirname(__file__))
    try:
        with open('config.mjs', 'r') as fi:
            txt=fi.read()
            result = re.findall(r'\d+.\d+.\d+.\d+', txt)
            host=socket.gethostname()
            ip=socket.gethostbyname(host)
            print(result)
            with open('config.mjs', 'w') as fo:
                for item in result:
                    txt = txt.replace(item, ip)
                    fo.write(txt)
        



        def f1():
            subprocess.call(['npm', 'start'])
        def f2():
            subprocess.call(['npm', 'run', 'dev'])

        t1=threading.Thread(target=f1)
        t2=threading.Thread(target=f2)

        t1.start()
        t2.start()
        clear()


        # url = f'http://{ip}:3000'
        # qr = qrcode.QRCode()

        # qr.add_data(url)
        # f = io.StringIO()
        # qr.print_ascii(out=f)

        # f.seek(0)
        # print(f.read())
        
    except KeyboardInterrupt:
        print('Завершаю работу программы')