# SWE-MehrMarkt


## Notwendigkeiten 

* <a href="https://www.docker.com/products/docker-desktop/">Docker</a> 


Docker ist erfolgreich installiert, wenn man diesen Befehl problemlos im Terminal ausführen kann. Bei Problemen siehe <a href="https://docs.docker.com/get-docker/">Docker Installation Guide</a>

```
docker --version
``` 


## Die Ausführung des Systems

1. SWE-Mehrmarkt.zip entpacken
2. SWE-Mehrmarkt Ordner im Terminal öffnen
3. Diesen Befehl ausführen
```
docker compose up --build

```

# Mögliche Probleme beim Compilieren:
Leider könnte man ein paar Probleme beim Ausführen begegnen, da das System nicht auf der Cloud läuft und daher gibt's keine einheitliche Einrichtung 

```
/bin/sh: 1: ./mvnw: not found

```
Siehe <a href="https://stackoverflow.com/questions/61226664/build-docker-error-bin-sh-1-mvnw-not-found">diese Lösung</a> 


