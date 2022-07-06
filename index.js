const puppeteer = require("puppeteer");
const fs = require("fs/promises");
require("dotenv").config();

const correo = process.env.EMAIL;
const password = process.env.PASSWORD;

console.log("Correo: ",correo);
console.log("Contraseña: ", password);

const start = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto("https://www.google.com/search?q=facebook", {
      timeout: 10000,
    });
    await page.goto("https://www.facebook.com/");
    await page.waitForTimeout(1500);

    await page.type("#email", correo);
    await page.type("#pass", password);
    await page.waitForTimeout(1500);

    await page.click("form button");
    console.log("Iniciando Sesión..");
    await page.waitForSelector(".k4urcfbm");

    const perfil = await page.$eval("[role=region] .k4urcfbm a", (x) => x.href);
    await page.goto(perfil);
    console.log("Abriendo perfil..");
    await page.waitForSelector(".bi6gxh9e h1");

    const nombrePerfil = await page.$eval(".bi6gxh9e h1", (x) => x.textContent);

    const amigos = await page.$eval(".dti9y0u4 a", (x) => x.textContent);
    const numeroAmigos = amigos.replace(" amigos", "");

    const info = {
      nombrePerfil,
      numeroAmigos,
    };

    //MUESTRA LA INFORMACIÓN
    console.log("Información:", info);

    const portada = await page.$eval(".rj1gh0hx a", (x) => x.href);
    await page.goto(portada);
    console.log("Abriendo portada..");

    await page.waitForSelector(".taijpn5t img");
    const linkImagenPortada = await page.$eval(".taijpn5t img", (x) => x.src);
    const imagenPortada = await page.goto(linkImagenPortada);
    const image = await imagenPortada.buffer();

    console.log("Descargando imagen..");
    await fs.writeFile("coverPhoto.png", image);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

start();
