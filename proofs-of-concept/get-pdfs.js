import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const url = "https://www.waukeshacounty.gov/"
const slug = "meetings/countyboard/"

await fetch(`${url}${slug}`)
    .then(result => {
        return result.text()
    })
    .then(content => {
        const $ = cheerio.load(content)

        const documents = $('.callout > table a[title~="Agenda"], .callout > table a[title~="Minutes"]')
        const resp = []

        for (let i = 0; i < documents.length; i++) {
            if (documents[i].attribs['href'].charAt(0) === '/') {
                resp.push({
                    type: documents[i].attribs['title'],
                    link: `${url}${documents[i].attribs['href']}`
                })
            } else {
                resp.push({
                    type: documents[i].attribs['title'],
                    link: `${url}${slug}${documents[i].attribs['href']}`
                })
            }
        }

        console.log(resp)
    })