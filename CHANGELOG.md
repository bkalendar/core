# Changelog

All notable changes to this project will be documented in this file.

The format is _roughly_ based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this
project adheres to [Calendar Versioning](https://calver.org/), using the scheme `YY.S`. The `YY.S`
part should correspond to the current academic year and semester of HCMUT-VNU.

## [24.1]

### Added

- Switch to `jsr.io` package registry.

### Fixed

- Handle Sunday as "CN" string.

## [23.3]

### Added

- Parse 2024 style timetable.

### Fixed

- Fix issue with semester line is not at fixed distance from table header.

## [23.2]

### Fixed

- Fix case-sensitive issue when finding table header.

## [23.1]

### Added

- Parser for postgrads' timetable.

### Fixed

- Handle `-` in place of empty time (instead of `00:00`).
- Handle `--|` weeks.

## [23.0]

### Added

- Parser for students and lecturers' timetable.
- Resolver for first date of semester.
- Formatter for `.ics` and Google Calendar.
- Errors throwing inside parser and resolver.
- Snapshot tests for basic cases.
