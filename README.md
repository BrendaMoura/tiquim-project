# Tiquim Project

## Overview

Tiquim is a crowdfunding platform that allows users to create campaigns to raise funds for projects or causes. This project was developed as part of the Web Academy UFAM training program, a partnership between the Federal University of Amazonas (UFAM), the Institute of Computing (ICOMP), and Motorola.

## Technologies

- React JS
- Prisma ORM
- MySQL

## Prerequisites

- make
- docker
- docker compose plugin

## Setup Instructions

### Step 1: Copy the .env files

```bash
make copy
```

### Step 2: Install project dependencies

```bash
make install
```

### Step 3: Start the application in Docker

```bash
make up
```

### Step 4: Seed the database with initial ID types

```bash
make seed
```
