# Movie World 🎬

A modern web application for exploring and managing movie information, built with Angular and Material Design.

## Features

- **Movie Database**: Access a comprehensive collection of movies
- **Detailed Information**: View detailed information about each movie including:
  - Basic details (title, year, genre)
  - Cast and crew information
  - Plot summaries
  - IMDB ratings
  - Movie posters
- **Search Functionality**: Find movies by title or other criteria
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean and intuitive interface using Material Design

## Technologies Used

- Angular 17
- Angular Material
- TypeScript
- SCSS
- OMDB API Integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kindBob/Movie-World.git
cd Movie-World
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── films/              # Films module
│   ├── shared/             # Shared components and services
│   └── app.component.ts    # Main app component
├── services/
│   └── omdb.service.ts     # OMDB API service
└── assets/                 # Static assets
```

## API Integration

The application uses the OMDB API to fetch movie information. The API key is configured in the `omdb.service.ts` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for providing movie data
- [Angular](https://angular.io/) for the amazing framework
- [Angular Material](https://material.angular.io/) for the UI components

## Contact 📧

For any questions or feedback, please open an issue in the GitHub repository.

---

Made with ❤️ by Vladyslav Kostromin
