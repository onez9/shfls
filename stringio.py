import io 

#data = io.StringIO() 
#data.write('JournalDev: ') 
#print('Python.', file=data) 
#print(data.getvalue()) 
#data.close()
#
#

#Чтение с использованием StringIO
#Записав некоторые данные в буфер StringIO, мы также можем их прочитать. Посмотрим на фрагмент кода:



inpu1t = io.StringIO('This goes into the read buffer.')

print(inpu1t.read())


#Чтение файла с помощью StringIO
#Также можно прочитать файл и передать его по сети в байтах. 
#Модуль io можно использовать для преобразования мультимедийного файла, 
#например изображения, в байты. Вот пример программы:

import io

file = io.open("pic1.png", "rb", buffering = 0)
print(file.read())
