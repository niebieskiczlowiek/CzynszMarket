USE master
GO

DROP DATABASE IF EXISTS RYNEK
GO

CREATE DATABASE RYNEK
GO

USE RYNEK
GO

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
	Data_Waznosci DATE NOT NULL,
	Status VARCHAR(20) CHECK(Status LIKE 'Dostepny' OR Status LIKE 'Nie Dostepny')
)

CREATE TABLE Przedmioty(
	Nazwa_Przedmiotu VARCHAR(50) NOT NULL CHECK(len(Nazwa_Przedmiotu) >= 5),
	Id_Przedmiotu INT PRIMARY KEY,
	Email_uzytkownika VARCHAR(50) NOT NULL REFERENCES Uzytkownicy(Email),
	Gra VARCHAR(50) NOT NULL REFERENCES Gry(Tytul)
)

USE RYNEK
GO

SELECT * FROM Uzytkownicy

INSERT INTO Uzytkownicy VALUES
('Admin', '1000', 'Adam', 'Czyz', 'TakXD', 'root1234')

INSERT INTO gry VALUES
('Crab Game')

INSERT INTO przedmioty VALUES
('Golden Sandals', 1, 'Adam@rynek.com', 'Crab Game')

ALTER table przedmioty
add rzadkosc varchar(30) check(rzadkosc = 'uncommon' OR rzadkosc = 'common' OR rzadkosc = 'rare' OR rzadkosc = 'epic' OR rzadkosc = 'legendary')

update przedmioty
SET rzadkosc = 'epic'
where Id_Przedmiotu = 1

ALTER table przedmioty
alter column rzadkosc varchar(30) not null check(rzadkosc = 'uncommon' OR rzadkosc = 'common' OR rzadkosc = 'rare' OR rzadkosc = 'epic' OR rzadkosc = 'legendary')

