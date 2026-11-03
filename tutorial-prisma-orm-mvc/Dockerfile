FROM postgres:16-bookworm

# 日本語ロケールを生成して、initdb 時にも UTF-8 / ja_JP を使う。
RUN apt-get update \
  && apt-get install -y --no-install-recommends locales \
  && sed -i '/^# ja_JP.UTF-8 UTF-8$/s/^# //' /etc/locale.gen \
  && locale-gen ja_JP.UTF-8 \
  && update-locale LANG=ja_JP.UTF-8 \
  && rm -rf /var/lib/apt/lists/*

# コンテナ内プロセスと初期化時のデフォルトロケールを日本語にそろえる。
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV POSTGRES_INITDB_ARGS="--encoding=UTF8 --locale=ja_JP.UTF-8"
