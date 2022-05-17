CREATE DATABASE RYNEK_INTERNET

CREATE TABLE Gry(
	Tytul VARCHAR(50) NOT NULL PRIMARY KEY 
)

CREATE TABLE Użytkownicy(
	Nazwa_Użytkownika VARCHAR(50) NOT NULL,
	Saldo MONEY,
	Imie VARCHAR(50) NOT NULL CHECK(len(Imie) >= 3),
	Nazwisko VARCHAR(50) NOT NULL CHECK(len(Nazwisko) >= 3),
	Email VARCHAR(50) NOT NULL PRIMARY KEY,
	Haslo VARCHAR(50) NOT NULL CHECK(len(Haslo) >= 8)
)

CREATE TABLE Oferty(
	Data_Wystawienia DATE NOT NULL,
	Data_Ważności DATE NOT NULL,
	Status VARCHAR(20) CHECK(Status LIKE 'Dostępny' OR Status LIKE 'Nie Dostępny')
)

CREATE TABLE Przedmioty(
	Nazwa_Przedmiotu VARCHAR(50) NOT NULL CHECK(len(Nazwa_Przedmiotu) >= 5),
	Id_Przedmiotu INT PRIMARY KEY,
	Email_użytkownika VARCHAR(50) NOT NULL REFERENCES Użytkownicy(Email),
	Gra VARCHAR(50) NOT NULL REFERENCES Gry(Tytul)
)

