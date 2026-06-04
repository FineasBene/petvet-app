import { test, expect } from '@playwright/test';

// Ne asigurăm că folosim portul generat de Vite
const URL = 'http://localhost:5173'; 

test.describe('E2E Tests - Silver Challenge PetVet', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('Feature 1: Autentificarea si accesul la Dashboard', async ({ page }) => {
    await page.click('button:has-text("Conectare")');
    await page.fill('input[type="email"]', 'demo@petvet.ro');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button.bp:has-text("Conectare")');

    if (await page.isVisible('text=Ce servicii cauți')) {
      await page.click('text=Coafor & Grooming');
      await page.click('button:has-text("Continuă")');
      await page.click('button:has-text("Începe!")');
    }

    await expect(page.locator('h2:has-text("Bun venit!")')).toBeVisible();
  });

  test('Feature 2: Adaugarea unui pacient in lista (Master/Detail CRUD)', async ({ page }) => {
    await page.click('button:has-text("Conectare")');
    await page.fill('input[type="email"]', 'demo@petvet.ro');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button.bp:has-text("Conectare")');

    if (await page.isVisible('text=Ce servicii cauți')) {
      await page.click('text=Coafor & Grooming');
      await page.click('button:has-text("Continuă")');
      await page.click('button:has-text("Începe!")');
    }

    await page.click('button:has-text("Animalele mele")');
    
    // Aici deschidem modalul (primul buton "Adaugă")
    await page.locator('button.bp:has-text("Adaugă")').first().click();
    
    await page.fill('input[placeholder="Max"]', 'GriveiTest');
    await page.selectOption('select:near(label:has-text("Specie"))', 'Câine');
    await page.selectOption('select:near(label:has-text("Rasă"))', 'Beagle');
    await page.selectOption('select:near(label:has-text("Gen"))', 'Mascul');
    await page.fill('input[type="number"]:near(label:has-text("Vârstă"))', '2');
    await page.fill('input[type="number"]:near(label:has-text("Greutate"))', '14');
    
    // REZOLVARE: Dăm click pe butonul "Adaugă" strict din interiorul modalului (.mi)
    await page.locator('.mi button.bp:has-text("Adaugă")').click();
    
    await expect(page.locator('text=GriveiTest adăugat!')).toBeVisible();
    await expect(page.locator('h3:has-text("GriveiTest")')).toBeVisible();
  });

  test('Feature 3: Filtrarea programarilor (Read/Filter)', async ({ page }) => {
    await page.click('button:has-text("Conectare")');
    await page.fill('input[type="email"]', 'vet@petvet.ro');
    await page.fill('input[type="password"]', 'vet123');
    await page.click('button.bp:has-text("Conectare")');

    if (await page.isVisible('text=Ce servicii cauți')) {
      await page.click('text=Coafor & Grooming');
      await page.click('button:has-text("Continuă")');
      await page.click('button:has-text("Începe!")');
    }

    await page.click('button:has-text("Programări")');
    await page.fill('input[placeholder="Caută..."]', 'Tuns');
    
    const rows = page.locator('tbody tr');
    await expect(rows).toContainText(['Tuns']);
  });
});