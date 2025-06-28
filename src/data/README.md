# Portfolio Data Configuration

This directory contains the JSON file that stores all the personal data for your portfolio website. You can easily edit your portfolio content by modifying the `portfolio.json` file without touching any code.

## File Structure

- `portfolio.json` - Contains all your portfolio data
- `README.md` - This documentation file

## How to Edit Your Portfolio

### Personal Information
Edit the `personal` section to update:
- Your name
- Professional title
- Tagline/bio
- Profile image URL
- Alt text for the image

### About Section
The `about` section contains:
- Section title
- Description paragraphs (array of strings)
- Statistics (years of experience, uptime, projects delivered)
- Expertise areas with icons and descriptions

### Experience
The `experience.jobs` array contains your work history:
- Job title
- Company name
- Time period
- Job description
- Technologies used

### Skills
The `skills.categories` object organizes your skills by category:
- Each category has an array of skill names
- Categories are automatically displayed as separate cards

### Projects
The `projects.items` array contains your featured projects:
- Project title
- Description
- Technologies used
- Impact/achievement

### Contact Information
The `contact` section includes:
- Section title and description
- Social media links (Email, LinkedIn, GitHub)
- Resume download link

### Footer
The `footer` section contains:
- Your name and title
- Copyright text

### Navigation
The `navigation` section defines:
- Available sections
- Home label text

## Example Edits

### Change Your Name
```json
{
  "personal": {
    "name": "Your New Name",
    "title": "Your Professional Title"
  }
}
```

### Add a New Job
```json
{
  "experience": {
    "jobs": [
      {
        "title": "New Job Title",
        "company": "New Company",
        "period": "2023 - Present",
        "description": "Your job description here",
        "technologies": ["Tech1", "Tech2", "Tech3"]
      }
    ]
  }
}
```

### Update Contact Links
```json
{
  "contact": {
    "links": [
      {
        "label": "Email",
        "href": "mailto:your.email@example.com",
        "color": "from-red-600 to-red-700"
      },
      {
        "label": "LinkedIn",
        "href": "https://linkedin.com/in/yourprofile",
        "color": "from-blue-600 to-blue-700"
      }
    ]
  }
}
```

## Tips

1. **Backup your data**: Make a copy of your `portfolio.json` file before making major changes
2. **Test changes**: After editing, run your development server to see the changes
3. **JSON validation**: Ensure your JSON is valid (no missing commas, brackets, etc.)
4. **Image URLs**: Use high-quality images and ensure the URLs are accessible
5. **Colors**: The color classes use Tailwind CSS format (e.g., "from-blue-600 to-blue-700")

## Type Safety

The portfolio data is fully typed with TypeScript interfaces defined in `src/types/portfolio.ts`. This ensures that:
- All required fields are present
- Data types are correct
- You get autocomplete in your IDE
- TypeScript will catch errors if the JSON structure is invalid

## File Locations

- Data file: `src/data/portfolio.json`
- Type definitions: `src/types/portfolio.ts`
- Main component: `src/App.tsx` 