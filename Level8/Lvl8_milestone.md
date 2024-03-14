# WD401 - Level 8: Implemention of i18n and l10n features in React.js application

## 1.Dynamic Content Translation:

Dynamic Content Translation in a React.js application involves enabling the translation of text content into different languages. Here's how you can implement this feature:1.

1.Setup i18n Library: Start by installing and configuring an i18n library such as react-i18next, react-intl, or i18next. These libraries provide tools to manage translations within your React application.
2.Create Language Files or Dictionaries: Define language files or dictionaries to store translations for different languages. Each file should contain key-value pairs where keys represent the original text in the default language (e.g., English), and values represent translations in other languages (e.g., Spanish). Organize translations for each language into separate files for better maintenance.

en.json: English translation

```json
{
  "translation": {
    "Assignee": "Assignee",
    "Cancel": "Cancel",
    "Comments": "Comments",
    "Create": "Create",
    "Delete": "Delete",
    "Description": "Description",
    "Details": "Details",
    "Done": "Done",
    "In progress": "In Progress",
    "Members": "Members",
    "Member": "Member",
    "New": "New",
    "Pending": "Pending",
    "Profile": "Profile",
    "Projects": "Projects",
    "Project": "Project",
    "Signin": "Sign In",
    "Signup": "Sign Up",
    "Submit": "Submit",
    "Task": "Task",
    "Title": "Title",
    "Update": "Update",
    "Name": "Name",
    "TaskDetails": "Task Details",
    "Loading...": "Loading...",
    "Username": "Username",
    "Password": "Password",
    "PageNotFound": "Page Not Found"
  }
}
```

es.json: Spanish Translation

```json
{
  "translation": {
    "Assignee": "Cesionario",
    "Cancel": "Cancelar",
    "Comments": "Comentarios",
    "Create": "Crear",
    "Delete": "Borrar",
    "Description": "Descripción",
    "Details": "Detalles",
    "Done": "Hecho",
    "In progress": "En curso",
    "Members": "Miembros",
    "Member": "Miembro",
    "New": "Nuevo",
    "Pending": "Pendiente",
    "Profile": "Perfil",
    "Projects": "Proyectos",
    "Project": "Proyecto",
    "Signin": "Iniciar sesión",
    "Signup": "Inscribirse",
    "Submit": "Entregar",
    "Task": "Tarea",
    "Title": "Título",
    "Update": "Actualizar",
    "Name": "Nombre",
    "TaskDetails": "Detalles de la tarea",
    "Loading...": "Cargando...",
    "Username": "Nombre de usuario",
    "Password": "Contraseña",
    "Page Not Found": "Página no encontrada"
  }
}
```

3. Integrate i18n Library: Integrate the chosen i18n library into your React application. Initialize the i18n instance, load language files, and set the default language. This step configures the i18n library to handle translations and language switching.
4. Implement Language Switching Mechanism: Create a mechanism to dynamically switch between languages based on user preferences or system settings. You can use UI elements like switches or dropdowns to allow users to select their preferred language. When a user switches the language, update the i18n configuration to use the selected language.

```jsx
  <Switch
    checked={enabled}
    onChange={toggleLanguage}
    className={`${enabled ? "bg-slate-400" : "bg-slate-700"}
relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
  >
    <span
      aria-hidden="true"
      className={`${enabled ? "translate-x-9" : "translate-x-0"}
pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
    />
  </Switch>
```

5. Apply Translation to Components: Use the i18n library to translate text content throughout your application. Replace hardcoded text with keys that correspond to the text in your language files. Then, use hooks or components provided by the i18n library (e.g., useTranslation hook in react-i18next) to access and display translated text in your React components.

```jsx
const { t } = useTranslation();

 <button
        type="button"
        id="newProjectBtn"
        onClick={openModal}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        {t("New")} {t("Project")}
 </button>
```



![image](https://github.com/Mahendar0701/wd401/assets/119734520/6d5aedaa-d8dc-42be-9c27-5ac193094020)

![image](https://github.com/Mahendar0701/wd401/assets/119734520/de25795e-79ed-48a6-af19-96c3eccad4d8)

## 2.Date and Time Localization:

### Date localisation
the dateFormatter function you provided effectively localizes dates based on the selected language. Here's a brief explanation of how it works:

```jsx

const dateFormatter = (isoDate, t, i18n) => {
  // Create a Date object from the provided ISO date string
  const date = new Date(isoDate);

  // Determine the locale based on the current language set in the i18n object
  const locale = i18n.language === "es" ? "fr-ES" : "en-US";

  // Define options for formatting the date
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  // Format the date using the toLocaleDateString method, which takes the locale and options
  const formattedDate = date.toLocaleDateString(locale, options);

  // Return the formatted date string
  return formattedDate;
};

```

### Time localisation

Time localization adapts time representation to suit cultural preferences, including formats like 12-hour or 24-hour clocks, time zone adjustments, and multilingual support for diverse user experiences.

```tsx
// Create a new Date object representing the current time
const currentTime = new Date();

// Define the locale-specific format for time using the Intl.DateTimeFormat constructor
// Specify the desired locale (e.g., "de-DE" for German) and the components of the time format (hour, minute, second)
const timeFormatter = new Intl.DateTimeFormat("de-DE", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

// Format the current time using the specified locale and format options
const formattedTime = timeFormatter.format(currentTime);

// The variable formattedTime now contains the localized time string, following the format specified for the specified locale

```




