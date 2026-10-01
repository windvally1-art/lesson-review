# Lesson Review (레슨 리뷰 / レッスンレビュー)

한국어 학원 학생들의 수업 기록과 월별 성장(평가) 데이터를 관리하는 React + Vite + Supabase 기반 웹 앱입니다.
韓国語学院の生徒の授業記録と月別の成長(評価)データを管理する、React + Vite + Supabase ベースの Web アプリです。

---

## 한국어

### 1. 프로젝트 소개

`lesson-review`는 한국어 선생님이 학생별로 **수업 기록**과 **월말 평가 점수**를 입력·관리하고, 월별 통계 리포트(레이더 차트, 영역별 점수 비교 등)를 볼 수 있도록 만든 1인/소규모 학원용 관리 도구입니다. 데이터는 Supabase(Postgres)에 저장되며, 프런트엔드는 React 19 + Vite + Tailwind CSS로 구현되어 있습니다.

### 2. 주요 기능

- **학생 관리**: 학생 추가 / 이름 수정 / 삭제 (삭제 시 해당 학생의 수업 기록·월별 평가도 함께 삭제)
- **수업 기록**: 수업일마다 발음·어휘·문법·듣기·말하기 5개 영역 점수(1~5점)를 입력/수정/삭제
- **월말 평가**: 월 단위로 5개 영역 평균 점수를 입력·수정하고, 과거 월별 성장 기록을 리스트로 확인
- **월별 통계 리포트**:
  - 선택한 월의 5개 영역 점수를 레이더(방사형) 차트로 시각화
  - 전월 대비 영역별 점수 변화(▲/▼) 비교표 제공
  - 수업 횟수, 종합 평균 요약 표시
- **반응형 레이아웃**: 모바일 화면에서도 보기 편하도록 `max-w-lg` 중심의 카드형 UI 사용

### 3. 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | React 19, Vite 8 |
| 스타일링 | Tailwind CSS 3 |
| 차트 | Recharts |
| 아이콘 | lucide-react |
| 백엔드/DB | Supabase (`@supabase/supabase-js`) |
| 린트 | ESLint |
| 테스트(옵션) | Playwright |

### 4. 폴더 구조 (핵심)

```
lesson-review/
├─ src/
│  ├─ App.jsx            # 전체 화면(학생 목록/관리, 수업 기록, 월말 평가, 월별 리포트 등)을 담은 단일 컴포넌트
│  ├─ assets/
│  │  ├─ arin-logo.png   # 상단 로고 이미지
│  │  └─ canva-icons/    # 영역별 아이콘(발음/어휘/문법/듣기/말하기 등)
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

### 5. 환경 변수 설정

Supabase 프로젝트의 URL과 공개(anon/publishable) 키가 필요합니다. 루트 디렉터리에 `.env` 파일을 만들고 아래와 같이 입력하세요(이 파일은 `.gitignore`에 포함되어 있어 커밋되지 않습니다).

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

### 6. Supabase 테이블 구조 (요약)

앱이 사용하는 테이블은 아래 3개입니다. (마이그레이션 파일은 포함되어 있지 않으므로, Supabase 콘솔에서 동일한 이름/컬럼으로 테이블을 직접 생성해야 합니다.)

- **students**: `id`, `name`
- **lesson_logs**: `id`, `student_name`, `date`, `pronunciation`, `vocabulary`, `grammar`, `listening`, `speaking` 등 수업별 점수
- **monthly_records**: `id`, `student_name`, `month`, `pronunciation`, `vocabulary`, `grammar`, `listening`, `speaking`, `habits`(학생의 자주 하는 실수를 기록하던 필드, 현재 UI에서는 숨김 처리되어 있지만 컬럼 자체는 유지)

---

## 日本語

### 1. プロジェクト概要

`lesson-review` は、韓国語の先生が生徒ごとに **授業記録** と **月末評価スコア** を入力・管理し、月別統計レポート(レーダーチャート、領域別スコア比較など)を確認できる、個人〜小規模スクール向けの管理ツールです。データは Supabase(Postgres)に保存され、フロントエンドは React 19 + Vite + Tailwind CSS で実装されています。

### 2. 主な機能

- **生徒管理**: 生徒の追加 / 名前の編集 / 削除(削除時は該当生徒の授業記録・月別評価も合わせて削除)
- **授業記録**: 授業日ごとに発音・語彙・文法・聞き取り・会話の5領域のスコア(1〜5点)を入力・編集・削除
- **月末評価**: 月単位で5領域の平均スコアを入力・編集し、過去の月別成長記録を一覧で確認
- **月別統計レポート**:
  - 選択した月の5領域スコアをレーダー(放射状)チャートで可視化
  - 前月比の領域別スコア変化(▲/▼)比較表を提供
  - 授業回数、総合平均のサマリー表示
- **レスポンシブレイアウト**: スマートフォンでも見やすいよう `max-w-lg` 中心のカード型 UI を採用

### 3. 技術スタック

| 領域 | 使用技術 |
|---|---|
| フレームワーク | React 19, Vite 8 |
| スタイリング | Tailwind CSS 3 |
| チャート | Recharts |
| アイコン | lucide-react |
| バックエンド/DB | Supabase (`@supabase/supabase-js`) |
| Lint | ESLint |
| テスト(任意) | Playwright |

### 4. フォルダ構成(主要部分)

```
lesson-review/
├─ src/
│  ├─ App.jsx            # 全画面(生徒一覧/管理、授業記録、月末評価、月別レポートなど)をまとめた単一コンポーネント
│  ├─ assets/
│  │  ├─ arin-logo.png   # 上部ロゴ画像
│  │  └─ canva-icons/    # 領域別アイコン(発音/語彙/文法/聞き取り/会話など)
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

### 5. 環境変数の設定

Supabase プロジェクトの URL と公開(anon/publishable)キーが必要です。ルートディレクトリに `.env` ファイルを作成し、以下のように入力してください(このファイルは `.gitignore` に含まれているためコミットされません)。

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_KEY=your-supabase-anon-key
```

### 6. Supabase テーブル構成(概要)

アプリが使用するテーブルは以下の3つです。(マイグレーションファイルは含まれていないため、Supabase コンソールで同じ名前・カラムのテーブルを直接作成する必要があります。)

- **students**: `id`, `name`
- **lesson_logs**: `id`, `student_name`, `date`, `pronunciation`, `vocabulary`, `grammar`, `listening`, `speaking` など、授業ごとのスコア
- **monthly_records**: `id`, `student_name`, `month`, `pronunciation`, `vocabulary`, `grammar`, `listening`, `speaking`, `habits`(生徒がよくするミスを記録していたフィールド。現在 UI 上では非表示になっていますが、カラム自体は保持されています)

