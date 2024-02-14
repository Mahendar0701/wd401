# WD401 - Level 2 : Optimizing JS Integration 

## Problem Statement
In your new role as a Web Developer, you're assigned to a project that involves optimizing the integration of JavaScript into a web application. The team emphasizes the importance of efficient JS bundling for enhanced application performance. As you embark on the development task, challenges related to bundling, code splitting, lazy loading, and the implementation of import maps surface. Your role is to address these challenges, showcasing your ability to optimize JS integration and explore advanced bundling techniques. The team is particularly interested in your practical application of concepts such as code splitting, lazy loading, and import maps to improve the application's overall performance.

## Webpack Configuration

Here's a sample Webpack configuration showcasing how to handle various file types and assets, specifically CSS and images:

```javascript

// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use : ['file-loader']
        type: 'asset/resource',
      },
    ],
  },
};


```

The configuration file, webpack.config.js, defines how Webpack should process and bundle your project. Let's break down the key components:

1. entry : Specifies the entry point of your application. In this case, it's set to ./src/index.js, indicating that Webpack should start bundling from this file.
2. output : Configures where Webpack should output the bundled code. The filename property is set to "bundle.js," and the path is set to ./dist, creating a bundle.js file in the dist directory.
3. module : Defines rules for different file types. Here, two rules are specified:
    For files ending with .css, use the 'style-loader' and 'css-loader' to handle and inject the styles into the document.
    For image files (ending with .png, .svg, .jpg, .jpeg, or .gif), use the 'file-loader' to manage and bundle these assets.
4. optimization : Utilizes the splitChunks optimization, which splits common dependencies into separate files to avoid unnecessary duplication. It's configured to include chunks from all entry points.


This configuration includes rules for handling CSS files using style-loader and css-loader, as well as image files using file-loader. The splitChunks optimization is set to create separate chunks for common dependencies.


## Advanced Bundling Techniques

### src/index.js
```javascript
import "../css/style.css";
import "./lazyModule.js";

import { fetchData } from "axios";

document.getElementById("lazy-button").addEventListener("click", () => {
    import("./lazyModule.js").then((module) => {
        module.default();
    });
});

console.log("hello world");


```

This code snippet demonstrates the use of code splitting and lazy loading. The CSS file and the lazyModule.js file are asynchronously loaded. The fetchData function from the axios library is imported, showcasing the benefits of code splitting by only including the necessary modules when needed.

CSS Handling: Imports the CSS file (style.css) using the import statement. This allows for bundling and handling CSS through the specified loaders in the webpack configuration.

Lazy Loading: Utilizes the import function to asynchronously load the lazyModule.js file when a button with the ID "lazy-button" is clicked. This enhances performance by only loading the module when needed.

Code Splitting: The fetchData function from the axios library is imported. This demonstrates code splitting, ensuring that only the necessary modules are included.

## Introduction to Import Maps

Import maps are a modern web standard that simplifies the management of JavaScript modules and dependencies in web applications. They provide a way to map module specifiers to actual URLs, making it easier to load and organize code.

### Benefits

1. Simplified Dependency Management: Import maps simplify the process of specifying dependencies, reducing the need for complex bundling configurations.

2. Reduced Overhead: Unlike traditional bundling, which combines all code into a single file, import maps allow you to load only the modules you need, reducing initial load times.

3. Versioning: Import maps can help manage module versions, ensuring that your application uses the correct version of a module.

## Implementing Import Maps

### index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
</head>

<body>
    Hello World

    <script src="src/index.js" type="module"></script>
    <script type="import-map" src="./import-map.json"></script>
</body>

</html>

   ```

Script Type Module: The script tag for src/index.js is updated with type="module", indicating that it's a JavaScript module. This enables modern module loading behavior.

Import Map Script: Includes an import map using <script type="import-map">, pointing to the import-map.json file.

example.js

```js
import { fetchData } from "data.js";

```

### import-map.json
```json
{
    "imports": {
        "lodash": "/path/to/lodash.js",
        "axios": "/path/to/axios.js"
    }
}

```

The import map defines mappings for the module specifiers "lodash" and "axios," specifying their respective URLs. This allows the application to load these modules dynamically based on the import map.
