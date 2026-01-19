--
-- PostgreSQL database dump
--

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11

-- Started on 2026-01-07 22:30:26 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16385)
-- Name: Attachments; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."Attachments" (
    "Id" uuid NOT NULL,
    "FileName" text NOT NULL,
    "RelativePath" text NOT NULL,
    "FileType" text NOT NULL,
    "FileSize" bigint NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "AuthorId" uuid NOT NULL,
    "TicketId" uuid NOT NULL
);


ALTER TABLE public."Attachments" OWNER TO appuser;

--
-- TOC entry 216 (class 1259 OID 16390)
-- Name: Notifications; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."Notifications" (
    "Id" uuid NOT NULL,
    "Type" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "IsRead" boolean NOT NULL,
    "TicketId" uuid NOT NULL,
    "UserId" uuid NOT NULL
);


ALTER TABLE public."Notifications" OWNER TO appuser;

--
-- TOC entry 217 (class 1259 OID 16393)
-- Name: RefreshTokens; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."RefreshTokens" (
    "Id" uuid NOT NULL,
    "TokenHash" text NOT NULL,
    "ExpiresAt" timestamp with time zone NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "RevokedAt" timestamp with time zone,
    "UserId" uuid NOT NULL
);


ALTER TABLE public."RefreshTokens" OWNER TO appuser;

--
-- TOC entry 218 (class 1259 OID 16398)
-- Name: TicketCategories; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."TicketCategories" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Description" character varying(1000)
);


ALTER TABLE public."TicketCategories" OWNER TO appuser;

--
-- TOC entry 219 (class 1259 OID 16403)
-- Name: TicketComments; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."TicketComments" (
    "Id" uuid NOT NULL,
    "TicketId" uuid NOT NULL,
    "Content" character varying(4000) NOT NULL,
    "AuthorId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."TicketComments" OWNER TO appuser;

--
-- TOC entry 220 (class 1259 OID 16408)
-- Name: Tickets; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."Tickets" (
    "Id" uuid NOT NULL,
    "Slug" integer NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" character varying(4000) NOT NULL,
    "Status" integer NOT NULL,
    "Priority" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "UserId" uuid NOT NULL,
    "AssistantId" uuid,
    "TicketCategoryId" uuid NOT NULL
);


ALTER TABLE public."Tickets" OWNER TO appuser;

--
-- TOC entry 221 (class 1259 OID 16413)
-- Name: Users; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."Users" (
    "Id" uuid NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "LastName" text NOT NULL,
    "Role" integer NOT NULL,
    "FirstName" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."Users" OWNER TO appuser;

--
-- TOC entry 222 (class 1259 OID 16419)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: appuser
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO appuser;

--
-- TOC entry 3474 (class 0 OID 16385)
-- Dependencies: 215
-- Data for Name: Attachments; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Attachments" ("Id", "FileName", "RelativePath", "FileType", "FileSize", "CreatedAt", "AuthorId", "TicketId") FROM stdin;
\.


--
-- TOC entry 3475 (class 0 OID 16390)
-- Dependencies: 216
-- Data for Name: Notifications; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Notifications" ("Id", "Type", "CreatedAt", "IsRead", "TicketId", "UserId") FROM stdin;
\.


--
-- TOC entry 3476 (class 0 OID 16393)
-- Dependencies: 217
-- Data for Name: RefreshTokens; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."RefreshTokens" ("Id", "TokenHash", "ExpiresAt", "CreatedAt", "RevokedAt", "UserId") FROM stdin;
019b9a7d-d2d5-7bc4-a5b1-5729d4e3762f	9//PpQcUi/zkDwjOA76IKHXNI4NZ6Mg+Kf0vcWvWDQo=	2026-01-14 22:04:55.89117+00	2026-01-07 22:04:55.891164+00	\N	42eceb32-4ecb-4919-8033-d84a5e33234d
019b9a7e-2bab-7e53-888e-0855ccce3e5c	mVvQEIX1X8WJXVmy58fGmX+D/m1Yhz0u06nTwbwxCqA=	2026-01-14 22:05:18.635739+00	2026-01-07 22:05:18.635739+00	\N	012e9883-239c-48f6-910a-5422c0a9df63
019b9a7f-11b8-7384-a178-b3a5e4509a7e	6GHpTeYrYp5yq0jOWoLVWA+2+BnJ+a56E/ARcWe0JU4=	2026-01-14 22:06:17.528555+00	2026-01-07 22:06:17.528555+00	\N	cead4604-3355-4489-8558-f347f88f16cc
019b9a82-0af1-7532-9d6c-b48a54043fe1	y2NRDqBFdfzB2xhD6C4MQmVqFyC2+ifMTwkGwsj7yMY=	2026-01-14 22:09:32.393994+00	2026-01-07 22:09:32.393988+00	\N	42eceb32-4ecb-4919-8033-d84a5e33234d
019b9a82-416b-71c2-a9ca-0fc6947ea6ac	eiCIacJU25uPJUdKvfWhK7JDNtzwCRKGllK44jcaJ3I=	2026-01-14 22:09:46.347127+00	2026-01-07 22:09:46.347127+00	\N	012e9883-239c-48f6-910a-5422c0a9df63
019b9a8a-f5a0-795a-8ef8-37b503e39ed7	2X2grdbUpc8vZlGlnxtdUb9uFP2haj1jRHZ2X+4qpjc=	2026-01-14 22:19:16.768682+00	2026-01-07 22:19:16.768682+00	\N	012e9883-239c-48f6-910a-5422c0a9df63
019b9a8f-40a7-7b99-87c1-1ab56cbb70c7	OSC2WHLWhFqB0xDybgfihe08hY0S494nz3OqXNnQhHE=	2026-01-14 22:23:58.119905+00	2026-01-07 22:23:58.119905+00	\N	42eceb32-4ecb-4919-8033-d84a5e33234d
019b9a90-f86a-78b5-94f2-6b8bad614b21	+VDIjex2H9bRR1oHJ68guGZCIqE6fa1YsvLQL+oegwc=	2026-01-14 22:25:50.698696+00	2026-01-07 22:25:50.698696+00	\N	cead4604-3355-4489-8558-f347f88f16cc
019b9a92-e15b-7379-b865-b947325b3a06	GRYXL5xtfGsCykdQ7CwiXuENP6veoHvTLaXmtbUjc8w=	2026-01-14 22:27:55.867618+00	2026-01-07 22:27:55.867618+00	\N	012e9883-239c-48f6-910a-5422c0a9df63
\.


--
-- TOC entry 3477 (class 0 OID 16398)
-- Dependencies: 218
-- Data for Name: TicketCategories; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."TicketCategories" ("Id", "Name", "Description") FROM stdin;
1b4f3a2e-2c6e-4a9f-8f1a-3f9b1c2d7e4a	Dostępy i uprawnienia (IAM)	Nadawanie/zmiana/odbieranie dostępów do narzędzi i zasobów (VPN, SSO, chmura, klastry, repozytoria, rejestry). Reset MFA/hasła, role, grupy i audyt uprawnień.
7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a	Repozytoria i kontrola wersji	Problemy i prośby dot. Git/repozytoriów (tworzenie projektów, uprawnienia, branch protection, merge policies, LFS), webhooki, integracje, utrata dostępu, porządki w repo.
2f8c1d3e-9b6a-4d5c-8e7f-1a2b3c4d5e6f	CI/CD i pipeline’y	Konfiguracja i awarie pipeline’ów (build/test/release), runnerzy/agenci, sekrety, cache, artefakty, wersjonowanie, harmonogramy, optymalizacja czasu i stabilności jobów.
9a7e6d5c-4b3a-4c2d-8e1f-0a9b8c7d6e5f	Deployment i wydania	Wsparcie przy wdrożeniach (deploy/rollback), strategie (blue-green/canary), tagowanie release’ów, okna wdrożeniowe, koordynacja oraz problemy z rolloutem na środowiskach.
3d2c1b0a-7e6f-4a5b-9c8d-1e2f3a4b5c6d	Środowiska (DEV/TEST/UAT)	Zakładanie, odtwarzanie i konfiguracja środowisk. Zmienne środowiskowe, konfiguracje usług, seed danych, dostępność, diagnoza problemów specyficznych dla środowiska.
a1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d	Kubernetes / kontenery	Klastry K8s i kontenery: namespace’y, RBAC, ingress, limity zasobów, problemy z podami, rejestry obrazów, Helm/Kustomize, konfiguracja i troubleshooting.
f0e1d2c3-b4a5-4c6d-8e9f-1a2b3c4d5e6a	Chmura i zasoby (IaaS/PaaS)	Provisioning i utrzymanie zasobów chmurowych (VM, sieci, storage, bazy, load balancery). Quoty, koszty, polityki, tagging, automatyzacja (Terraform).
6e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c2b	Sekrety, certyfikaty i konfiguracja	Zarządzanie sekretami (Vault/Secrets Manager), rotacja kluczy, certyfikaty TLS, konfiguracja SSO/OIDC, odnowienia, wycieki sekretów, standardy przechowywania i dostępu.
\.


--
-- TOC entry 3478 (class 0 OID 16403)
-- Dependencies: 219
-- Data for Name: TicketComments; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."TicketComments" ("Id", "TicketId", "Content", "AuthorId", "CreatedAt") FROM stdin;
dbd86056-a687-475f-9d65-7918897680f7	6fb07f38-4c4b-479a-86bc-6055dcb948b9	Będziemy potrzebować approve od Twojego project managera.	42eceb32-4ecb-4919-8033-d84a5e33234d	2026-01-07 22:25:31.818522+00
f15df8c8-9de2-4752-ae73-82fd3d2c1d1e	f0e034d1-5965-495f-b046-dc6d40a0838e	Czekamy na odpowiedź od zewnętrznego zespołu.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-07 22:26:52.195836+00
40e17d62-0e89-4fb1-be42-2efba335be4a	38ebcb91-b9f0-40d5-aa33-b7529fa88713	Certyfikat został odświeżony do 1 stycznia 2027 roku. Proszę o potwierdzenie, czy teraz już wszystko jest w porządku po Waszej stronie.	cead4604-3355-4489-8558-f347f88f16cc	2026-01-07 22:27:39.07162+00
7f4e3a29-f742-4084-9504-69fd4d468fa2	38ebcb91-b9f0-40d5-aa33-b7529fa88713	Potwierdzam. Certyfikat został odnowiony. Można zamknąć zgłoszenie.	012e9883-239c-48f6-910a-5422c0a9df63	2026-01-07 22:29:00.848839+00
\.


--
-- TOC entry 3479 (class 0 OID 16408)
-- Dependencies: 220
-- Data for Name: Tickets; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Tickets" ("Id", "Slug", "Title", "Description", "Status", "Priority", "CreatedAt", "UpdatedAt", "UserId", "AssistantId", "TicketCategoryId") FROM stdin;
4f93920e-09d9-4d58-85da-21f3f6384970	5	Wygasł mi dostęp do VPN / nie mogę połączyć się z siecią firmową	Nie mogę połączyć się z VPN (błąd …) i przez to nie mam dostępu do środowisk/testów/klastrów. Używam klienta …, system …, ostatnio działało … (data/godzina). Próbowałem restartu, ponownej instalacji i logowania przez SSO/MFA. Proszę o sprawdzenie mojego konta i przywrócenie dostępu.	0	1	2026-01-07 22:20:27.604654+00	2026-01-07 22:20:27.604654+00	012e9883-239c-48f6-910a-5422c0a9df63	\N	f0e1d2c3-b4a5-4c6d-8e9f-1a2b3c4d5e6a
f42650a0-97ec-49dc-a1f1-890ac677f914	2	Nie mogę zrobić push do repozytorium (permission denied)	Od dziś nie mogę wypchnąć zmian do repo. Przy próbie git push dostaję błąd „permission denied”/„403”. Repo: …, mój login: …. Problem występuje na (HTTPS/SSH). Jeśli SSH: mój publiczny klucz ma fingerprint …. Potrzebuję przywrócenia uprawnień do zapisu.	1	1	2025-12-25 10:45:00.934626+00	2026-01-07 22:25:09.174562+00	012e9883-239c-48f6-910a-5422c0a9df63	42eceb32-4ecb-4919-8033-d84a5e33234d	7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a
6fb07f38-4c4b-479a-86bc-6055dcb948b9	0	Prośba o dostęp do repozytorium GitHub	Jestem nowym pracownikiem i potrzebuję dostępu do repozytorium aplikacji AppX na GitHubie.	2	3	2026-12-21 20:15:40.504498+00	2026-01-07 22:25:31.823751+00	012e9883-239c-48f6-910a-5422c0a9df63	42eceb32-4ecb-4919-8033-d84a5e33234d	7c2d9a10-5d8f-4f2b-9a3e-0b1c2d3e4f5a
f0e034d1-5965-495f-b046-dc6d40a0838e	4	Deploy na DEV nie dochodzi do skutku — aplikacja nie wstaje	Wdrożenie wersji … na środowisko DEV nie przechodzi: rollout stoi albo pody wpadają w CrashLoopBackOff/brak readiness. Usługa: …, namespace/projekt: …, czas ostatniej próby: …. Dołączam logi z poda i wynik kubectl describe pod …. Potrzebuję, żeby środowisko wróciło do działania lub żebym dostał instrukcję co poprawić.	3	2	2026-01-04 12:50:10.779149+00	2026-01-07 22:26:52.195998+00	012e9883-239c-48f6-910a-5422c0a9df63	cead4604-3355-4489-8558-f347f88f16cc	3d2c1b0a-7e6f-4a5b-9c8d-1e2f3a4b5c6d
2d80da5b-4d3d-4353-8b53-c366ed78e89a	3	Pipeline w CI/CD ciągle failuje po moim merge (build/test)	Po zmergowaniu MR/PR … pipeline na gałęzi … nie przechodzi. Pada na jobie … z błędem … (wkleiłem fragment logów). Lokalnie testy/build przechodzą. Proszę o pomoc w diagnozie (runner, cache, zależności, konfiguracja joba).	0	0	2026-01-01 18:18:38.480718+00	2026-01-01 18:18:38.480718+00	012e9883-239c-48f6-910a-5422c0a9df63	\N	2f8c1d3e-9b6a-4d5c-8e7f-1a2b3c4d5e6f
38ebcb91-b9f0-40d5-aa33-b7529fa88713	1	Odświeżenie certyfikatu SSL	Certyfikat SSL dla naszej aplikacji internetowej AppX wygasł 28 grudnia 2025. Potrzebujemy go odnowić.	4	2	2026-12-20 11:11:45.953324+00	2026-01-07 22:29:00.848919+00	012e9883-239c-48f6-910a-5422c0a9df63	cead4604-3355-4489-8558-f347f88f16cc	6e5d4c3b-2a1f-4e0d-9c8b-7a6f5e4d3c2b
\.


--
-- TOC entry 3480 (class 0 OID 16413)
-- Dependencies: 221
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."Users" ("Id", "Email", "PasswordHash", "LastName", "Role", "FirstName") FROM stdin;
012e9883-239c-48f6-910a-5422c0a9df63	piotrnowak@gmail.com	AQAAAAIAAYagAAAAEAZ+OO+huVlR87mUWTGEIMqkB6L5OLSekYJyToYqe+ChL4y4GaBFgmCiZ+urKxr/LQ==	Nowak	0	Piotr
42eceb32-4ecb-4919-8033-d84a5e33234d	jankowalski@gmail.com	AQAAAAIAAYagAAAAED92lh8Oee7e3XCWKHWsR/gbwan5/A6BvRoQA025gMZiAB1PzWOznruyRL4ydB4pJA==	Kowalski	1	Jan
cead4604-3355-4489-8558-f347f88f16cc	monikalewandowska@gmail.com	AQAAAAIAAYagAAAAEMsiOkiJKWmokN8c3rkItGuTTsPUbXCYxEr58UHaBl5iWndNL3fcr2UrnVzDX7zMdA==	Lewandowska	1	Monika
\.


--
-- TOC entry 3481 (class 0 OID 16419)
-- Dependencies: 222
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: appuser
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20251227223726_Initial	10.0.1
20251228002050_AddLastNameForUser	10.0.1
20260102161357_Add notifications table	10.0.1
20260102165213_Update	10.0.1
20260104183728_Add Attachments	10.0.1
\.


--
-- TOC entry 3298 (class 2606 OID 16423)
-- Name: Attachments PK_Attachments; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Attachments"
    ADD CONSTRAINT "PK_Attachments" PRIMARY KEY ("Id");


--
-- TOC entry 3302 (class 2606 OID 16425)
-- Name: Notifications PK_Notifications; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "PK_Notifications" PRIMARY KEY ("Id");


--
-- TOC entry 3305 (class 2606 OID 16427)
-- Name: RefreshTokens PK_RefreshTokens; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id");


--
-- TOC entry 3307 (class 2606 OID 16429)
-- Name: TicketCategories PK_TicketCategories; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."TicketCategories"
    ADD CONSTRAINT "PK_TicketCategories" PRIMARY KEY ("Id");


--
-- TOC entry 3311 (class 2606 OID 16431)
-- Name: TicketComments PK_TicketComments; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."TicketComments"
    ADD CONSTRAINT "PK_TicketComments" PRIMARY KEY ("Id");


--
-- TOC entry 3316 (class 2606 OID 16433)
-- Name: Tickets PK_Tickets; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "PK_Tickets" PRIMARY KEY ("Id");


--
-- TOC entry 3318 (class 2606 OID 16435)
-- Name: Users PK_Users; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");


--
-- TOC entry 3320 (class 2606 OID 16437)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 3295 (class 1259 OID 16438)
-- Name: IX_Attachments_AuthorId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Attachments_AuthorId" ON public."Attachments" USING btree ("AuthorId");


--
-- TOC entry 3296 (class 1259 OID 16439)
-- Name: IX_Attachments_TicketId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Attachments_TicketId" ON public."Attachments" USING btree ("TicketId");


--
-- TOC entry 3299 (class 1259 OID 16440)
-- Name: IX_Notifications_TicketId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Notifications_TicketId" ON public."Notifications" USING btree ("TicketId");


--
-- TOC entry 3300 (class 1259 OID 16441)
-- Name: IX_Notifications_UserId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Notifications_UserId" ON public."Notifications" USING btree ("UserId");


--
-- TOC entry 3303 (class 1259 OID 16442)
-- Name: IX_RefreshTokens_UserId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_RefreshTokens_UserId" ON public."RefreshTokens" USING btree ("UserId");


--
-- TOC entry 3308 (class 1259 OID 16443)
-- Name: IX_TicketComments_AuthorId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_TicketComments_AuthorId" ON public."TicketComments" USING btree ("AuthorId");


--
-- TOC entry 3309 (class 1259 OID 16444)
-- Name: IX_TicketComments_TicketId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_TicketComments_TicketId" ON public."TicketComments" USING btree ("TicketId");


--
-- TOC entry 3312 (class 1259 OID 16445)
-- Name: IX_Tickets_AssistantId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Tickets_AssistantId" ON public."Tickets" USING btree ("AssistantId");


--
-- TOC entry 3313 (class 1259 OID 16446)
-- Name: IX_Tickets_TicketCategoryId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Tickets_TicketCategoryId" ON public."Tickets" USING btree ("TicketCategoryId");


--
-- TOC entry 3314 (class 1259 OID 16447)
-- Name: IX_Tickets_UserId; Type: INDEX; Schema: public; Owner: appuser
--

CREATE INDEX "IX_Tickets_UserId" ON public."Tickets" USING btree ("UserId");


--
-- TOC entry 3321 (class 2606 OID 16448)
-- Name: Attachments FK_Attachments_Tickets_TicketId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Attachments"
    ADD CONSTRAINT "FK_Attachments_Tickets_TicketId" FOREIGN KEY ("TicketId") REFERENCES public."Tickets"("Id") ON DELETE CASCADE;


--
-- TOC entry 3322 (class 2606 OID 16453)
-- Name: Attachments FK_Attachments_Users_AuthorId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Attachments"
    ADD CONSTRAINT "FK_Attachments_Users_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 3323 (class 2606 OID 16458)
-- Name: Notifications FK_Notifications_Tickets_TicketId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "FK_Notifications_Tickets_TicketId" FOREIGN KEY ("TicketId") REFERENCES public."Tickets"("Id") ON DELETE CASCADE;


--
-- TOC entry 3324 (class 2606 OID 16463)
-- Name: Notifications FK_Notifications_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Notifications"
    ADD CONSTRAINT "FK_Notifications_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 3325 (class 2606 OID 16468)
-- Name: RefreshTokens FK_RefreshTokens_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 3326 (class 2606 OID 16473)
-- Name: TicketComments FK_TicketComments_Tickets_TicketId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."TicketComments"
    ADD CONSTRAINT "FK_TicketComments_Tickets_TicketId" FOREIGN KEY ("TicketId") REFERENCES public."Tickets"("Id") ON DELETE CASCADE;


--
-- TOC entry 3327 (class 2606 OID 16478)
-- Name: TicketComments FK_TicketComments_Users_AuthorId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."TicketComments"
    ADD CONSTRAINT "FK_TicketComments_Users_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- TOC entry 3328 (class 2606 OID 16483)
-- Name: Tickets FK_Tickets_TicketCategories_TicketCategoryId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "FK_Tickets_TicketCategories_TicketCategoryId" FOREIGN KEY ("TicketCategoryId") REFERENCES public."TicketCategories"("Id") ON DELETE CASCADE;


--
-- TOC entry 3329 (class 2606 OID 16488)
-- Name: Tickets FK_Tickets_Users_AssistantId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "FK_Tickets_Users_AssistantId" FOREIGN KEY ("AssistantId") REFERENCES public."Users"("Id");


--
-- TOC entry 3330 (class 2606 OID 16493)
-- Name: Tickets FK_Tickets_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: appuser
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "FK_Tickets_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


-- Completed on 2026-01-07 22:30:26 UTC

--
-- PostgreSQL database dump complete
--