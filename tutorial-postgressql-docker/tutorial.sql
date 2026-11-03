--
-- PostgreSQL database dump
--

\restrict NoekfHgfbxlRfACF6dIUanVkOXj2KhDju1nMdSuEAigQfby0vs6qPr0O3DRfEvZ

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg12+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg12+2)

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
-- Name: categories; Type: TABLE; Schema: public; Owner: mydbuser
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categories OWNER TO mydbuser;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: mydbuser
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: post_categories; Type: TABLE; Schema: public; Owner: mydbuser
--

CREATE TABLE public.post_categories (
    id integer NOT NULL,
    post_id integer NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.post_categories OWNER TO mydbuser;

--
-- Name: post_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: mydbuser
--

ALTER TABLE public.post_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.post_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: mydbuser
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    body text NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.posts OWNER TO mydbuser;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: mydbuser
--

ALTER TABLE public.posts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: mydbuser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    age integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO mydbuser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mydbuser
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: mydbuser
--

COPY public.categories (id, code, name, created_at, updated_at) FROM stdin;
1	programming	プログラミング	2026-11-03 11:18:35.549778	2026-11-03 11:18:35.549778
2	work	仕事	2026-11-03 11:18:35.549778	2026-11-03 11:18:35.549778
3	hobby	趣味	2026-11-03 11:18:35.549778	2026-11-03 11:18:35.549778
\.


--
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: mydbuser
--

COPY public.post_categories (id, post_id, category_id, created_at, updated_at) FROM stdin;
1	1	1	2026-11-03 11:18:35.553492	2026-11-03 11:18:35.553492
2	2	1	2026-11-03 11:18:35.553492	2026-11-03 11:18:35.553492
3	3	1	2026-11-03 11:18:35.553492	2026-11-03 11:18:35.553492
4	3	3	2026-11-03 11:18:35.553492	2026-11-03 11:18:35.553492
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: mydbuser
--

COPY public.posts (id, user_id, title, body, status, created_at, updated_at) FROM stdin;
1	1	プログラミング学んでみた感想	ほげほげ	0	2026-11-03 11:18:35.551574	2026-11-03 11:18:35.551574
2	2	CSSでドラえもんを描いてみた	ふがー	0	2026-11-03 11:18:35.551574	2026-11-03 11:18:35.551574
3	3	Ruby 会議に参加してみた	ほげー	0	2026-11-03 11:18:35.551574	2026-11-03 11:18:35.551574
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mydbuser
--

COPY public.users (id, name, age, created_at, updated_at) FROM stdin;
1	Andy	20	2026-11-03 11:18:35.546293	2026-11-03 11:18:35.546293
2	Bob	30	2026-11-03 11:18:35.546293	2026-11-03 11:18:35.546293
3	Charlie	30	2026-11-03 11:18:35.546293	2026-11-03 11:18:35.546293
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mydbuser
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: post_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mydbuser
--

SELECT pg_catalog.setval('public.post_categories_id_seq', 4, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mydbuser
--

SELECT pg_catalog.setval('public.posts_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mydbuser
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: post_categories post_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: post_categories post_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: post_categories post_categories_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.post_categories
    ADD CONSTRAINT post_categories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mydbuser
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO mydbuser;


--
-- PostgreSQL database dump complete
--

\unrestrict NoekfHgfbxlRfACF6dIUanVkOXj2KhDju1nMdSuEAigQfby0vs6qPr0O3DRfEvZ

