CREATE DATABASE RYNEK_INTERNET

CREATE TABLE Gry(
	Tytul VARCHAR(50) NOT NULL PRIMARY KEY 
)

CREATE TABLE Uzytkownicy(
	Nazwa_Uzytkownika VARCHAR(50) NOT NULL,
	Saldo MONEY,
	Imie VARCHAR(50) NOT NULL CHECK(len(Imie) >= 3),
	Nazwisko VARCHAR(50) NOT NULL CHECK(len(Nazwisko) >= 3),
	Email VARCHAR(50) NOT NULL PRIMARY KEY,
	Haslo VARCHAR(50) NOT NULL CHECK(len(Haslo) >= 8)
)

CREATE TABLE Oferty(
	Data_Wystawienia DATE NOT NULL,
	Data_Waznoœci DATE NOT NULL,
	Status VARCHAR(20) CHECK(Status LIKE 'Dostêpny' OR Status LIKE 'Nie Dostêpny')
)

CREATE TABLE Przedmioty(
	Nazwa_Przedmiotu VARCHAR(50) NOT NULL CHECK(len(Nazwa_Przedmiotu) >= 5),
	Id_Przedmiotu INT PRIMARY KEY,
	Email_uzytkownika VARCHAR(50) NOT NULL REFERENCES Uzytkownicy(Email),
	Gra VARCHAR(50) NOT NULL REFERENCES Gry(Tytul)
)

