import type { Festival } from './festivals';

/**
 * วันบูชาเทพฮินดูรายปีที่คนไทยนิยมไหว้ (เล็กกว่านวราตรี/ดิวาลี)
 * วันที่: Drik Panchang คำนวณสำหรับกรุงเทพฯ (geoname-id=1609350) เทียบกับปฏิทินวัดแขก สีลม ปี 2569 ซึ่งตรงกันทุกงาน
 * ใส่เฉพาะวันที่ยืนยันแล้ว งานปี 2569 ผ่านไปแล้วทั้งหมด (ตรวจ 2026-10-19) จึงมีเฉพาะปี 2570
 */
export const HINDU_DAY_FESTIVALS: Festival[] = [
  {
    slug: "ganesh-chaturthi",
    name: "วันคเณศจตุรถี",
    tagline: "วันคเณศจตุรถี 2570 วันเกิดพระพิฆเนศ ตรงกับวันไหน ของไหว้ วิธีไหว้ที่บ้าน และที่ไหว้ในไทย",
    seoTitle: "วันเกิดพระพิฆเนศ วันไหน ของไหว้ วิธีไหว้ และที่ไหว้ในไทย",
    goals: ["career", "business", "study", "money"],
    placeFilter: { deity: "ganesha" },
    featureDays: 30,
    dates: [
      {
        year: 2027,
        start: "2027-09-04",
        end: "2027-09-04",
        notes: "วันคเณศจตุรถี เสาร์ 4 ก.ย. 2570 ตาม Drik Panchang คำนวณสำหรับกรุงเทพฯ (ทิถีจตุรถี 15.48 น. 3 ก.ย. - 13.55 น. 4 ก.ย.) ตรงกับ Dekho Panchang (อ้างอิงเดลี) วันวิสรชัน (ลอยองค์) อังคาร 14 ก.ย. 2570 ปี 2569 วัดแขก สีลม จัดวันที่ 14 ก.ย. ซึ่งตรงกับ Drik Panchang กรุงเทพฯ ปี 2570 วัดยังไม่ประกาศกำหนดการ"
      }
    ],
    content: {
      checkedAt: "2026-10-19",
      intro: "วันคเณศจตุรถี คือวันฉลองการประสูติของพระพิฆเนศ เทพแห่งความสำเร็จ ตรงกับวันขึ้น 4 ค่ำ เดือนภัทรบท (เดือน 10 ตามปฏิทินฮินดู) ตำนานที่เล่ากันมากที่สุดคือ พระแม่ปารวตีปั้นพระพิฆเนศจากดินไว้คุ้มครองพระองค์ เมื่อพระพิฆเนศขวางระหว่างพระศิวะกับพระแม่ปารวตี พระศิวะจึงตัดเศียร แล้วประทานเศียรช้างให้แทน รายละเอียดต่างกันไปตามคัมภีร์ ในอินเดียฉลองต่อเนื่องราว 10 วัน จบที่วันอนันตจตุรทศีด้วยการแห่องค์ดินไปลอยน้ำ ปี 2570 วันคเณศจตุรถีตรงกับวันเสาร์ที่ 4 ก.ย. 2570",
      lunarNote: "นับตามทิถีจตุรถีในปฏิทินจันทรคติฮินดู วันจึงเปลี่ยนทุกปี Drik Panchang (คำนวณสำหรับกรุงเทพฯ) ให้ทิถีจตุรถีเริ่ม 15.48 น. วันที่ 3 ก.ย. ถึง 13.55 น. วันที่ 4 ก.ย. 2570 ฤกษ์บูชาช่วงเที่ยง (มัธยาหน) 11.03-13.31 น. วันที่ 4 ก.ย. และวันวิสรชันคือ 14 ก.ย. 2570 ปฏิทินอินเดีย (Dekho Panchang อ้างอิงเดลี) ก็ให้วันที่ 4 ก.ย. ตรงกัน ปี 2569 วัดแขก สีลม จัดพิธีวันที่ 14 ก.ย. ตรงกับที่ Drik Panchang คำนวณสำหรับกรุงเทพฯ",
      rulesTitle: "ข้อควรรู้วันคเณศจตุรถี",
      rules: [
        {
          text: "ตามความเชื่อห้ามมองพระจันทร์ขณะที่ทิถีจตุรถียังอยู่ เชื่อว่าจะถูกใส่ร้าย (มิถยาโทษ) ตามตำนานที่พระกฤษณะถูกกล่าวหาว่าขโมยแก้วสยมันตกะ ช่วงที่ควรเลี่ยงในกรุงเทพฯ คือ 3 ก.ย. 2570 เวลา 15.48-20.16 น. และ 4 ก.ย. 2570 เวลา 09.18-21.00 น.",
          source: "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          text: "บูชาที่บ้านได้ตามสะดวก จะบูชา 1 วัน 1 วันครึ่ง 3 วัน 5 วัน หรือ 7 วันก็ได้ ขั้นตอนเพิ่มหรือลดได้ตามความเหมาะสม",
          source: "https://www.sanook.com/horoscope/261031/"
        },
        {
          text: "เทวรูปที่บูชาประจำบ้านไม่ต้องนำไปลอยน้ำ พิธีวิสรชันใช้กับองค์ที่ปั้นจากดินเพื่อบูชาช่วงเทศกาล บูชาวันสุดท้ายเสร็จแล้วให้อัญเชิญเทวรูปประจำบ้านกลับขึ้นหิ้ง",
          source: "https://www.sanook.com/horoscope/261031/"
        },
        {
          text: "วัดแขก สีลม ห้ามนำของคาวเข้าบริเวณโบสถ์ และผู้หญิงที่มีประจำเดือนห้ามเข้าบริเวณโบสถ์",
          source: "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt"
        },
        {
          text: "ไปร่วมพิธีที่เทวาลัยพระพิฆเนศ ห้วยขวาง ให้แต่งกายสุภาพและทำตามคำแนะนำของเจ้าหน้าที่",
          source: "https://travel.trueid.net/detail/6eaWB9vOQlZp"
        }
      ],
      sections: [
        {
          title: "ของไหว้พระพิฆเนศ",
          style: "checklist",
          intro: "เลือกเท่าที่สะดวก ไม่จำเป็นต้องครบทุกอย่าง",
          items: [
            {
              name: "ดอกไม้สีแดงหรือดอกดาวเรือง",
              text: "ดอกชบาแดง ดอกดาวเรือง และพวงมาลัย",
              source: "https://www.bangkokbiznews.com/lifestyle/judprakai/1143440"
            },
            {
              name: "ขนมโมทกะ และขนมลาดู",
              text: "ขนมหวานที่นิยมถวายพระพิฆเนศ",
              source: "https://www.sanook.com/horoscope/261031/"
            },
            {
              name: "ผลไม้ตามฤดูกาล",
              text: "ผลไม้มงคลอะไรก็ได้ที่หาได้ตามฤดู",
              source: "https://mthai.com/ganesha/418408.html"
            },
            {
              name: "หญ้าแพรก หมาก พลู",
              text: "ถวายหลังผลไม้และขนมหวาน",
              source: "https://www.sanook.com/horoscope/261031/"
            },
            {
              name: "น้ำปัญจมรัตน์ และน้ำสะอาด",
              text: "น้ำปัญจมรัตน์คือนม นมเปรี้ยวหรือโยเกิร์ต เนย น้ำผึ้ง และน้ำตาลหรือน้ำอ้อย ใช้สรงเทวรูป แล้วล้างด้วยน้ำสะอาด",
              source: "https://www.bangkokbiznews.com/lifestyle/judprakai/1143440"
            },
            {
              name: "ธูปหรือกำยาน ประทีปหรือเทียน",
              text: "ใช้ตอนถวายธูปและทำอารตี",
              source: "https://www.sanook.com/horoscope/261031/"
            }
          ]
        },
        {
          title: "วิธีไหว้พระพิฆเนศที่บ้าน",
          style: "steps",
          intro: "ย่อจากพิธีบูชา 16 ขั้นตอน วันอื่นนอกจากวันแรกและวันสุดท้ายจะสวดมนต์และถวายผลไม้ขนมหวานโดยไม่ต้องสรงน้ำก็ได้",
          items: [
            {
              name: "อัญเชิญขึ้นแท่น",
              text: "อัญเชิญพระพิฆเนศขึ้นประทับบนแท่นหรือผ้าปูอาสนะ นิยมสีแดงหรือส้ม",
              source: "https://www.sanook.com/horoscope/261031/"
            },
            {
              name: "ถวายน้ำ",
              text: "ถวายน้ำล้างพระบาท พระหัตถ์ และพระโอษฐ์ แล้วสรงด้วยน้ำปัญจมรัตน์ ล้างด้วยน้ำสะอาด เช็ดองค์ให้แห้ง",
              source: "https://www.sanook.com/horoscope/261031/"
            },
            {
              name: "แต่งองค์",
              text: "ถวายผ้า เจิมผงและน้ำหอม เครื่องประดับ (ใช้เหรียญหรือข้าวสารแทนได้) ดอกไม้และมาลัย",
              source: "https://www.sanook.com/horoscope/261031/"
            },
            {
              name: "ถวายของไหว้",
              text: "จุดธูปหรือกำยาน ประทีป แล้วถวายผลไม้ ขนมหวาน หมาก พลู และหญ้าแพรก",
              source: "https://www.sanook.com/horoscope/261031/"
            },
            {
              name: "สวดบูชาและอารตี",
              text: "สวดบทบูชาสรรเสริญ แล้ววนไฟถวาย (อารตี)",
              source: "https://www.sanook.com/horoscope/261031/"
            }
          ]
        }
      ],
      venues: [
        {
          name: "วันประสูติพระพิฆเนศ วัดแขก สีลม",
          province: "กรุงเทพมหานคร",
          placeName: "วัดพระศรีมหาอุมาเทวี (วัดแขก สีลม) เขตบางรัก",
          dates: "ปี 2570 ยังไม่ประกาศ (ปี 2569 จัดวันจันทร์ 14 ก.ย.)",
          description: "ปี 2569 มีพิธีบูชาเช้า 09.30 น. และพิธีบูชาเย็น 17.30 น. คนที่ทำบุญถาดเครื่องบูชาชุดใหญ่ 100 บาท ได้รับผ้ายันต์พระพิฆเนศชุดพิเศษ แจกเฉพาะวันงานและมีจำนวนจำกัด",
          sources: [
            "https://travel.trueid.net/detail/6eaWB9vOQlZp",
            "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
          ]
        },
        {
          name: "พิธีบวงสรวงพระพิฆเนศ ห้วยขวาง",
          province: "กรุงเทพมหานคร",
          placeName: "เทวาลัยพระพิฆเนศ สี่แยกรัชดา-ห้วยขวาง",
          dates: "ปี 2570 ยังไม่ประกาศ (ปี 2569 จัด 14 ก.ย. 21.00-22.00 น.)",
          description: "ปี 2569 มีพิธีบวงสรวง สวดมนต์ และขอพรช่วงค่ำ คนที่ไม่ได้ร่วมพิธีมาไหว้องค์พระพิฆเนศได้ตลอด 24 ชั่วโมง",
          sources: ["https://travel.trueid.net/detail/6eaWB9vOQlZp"]
        },
        {
          name: "คเณศจตุรถี อุทยานพระพิฆเนศ คลองเขื่อน",
          province: "ฉะเชิงเทรา",
          placeName: "อุทยานพระพิฆเนศ (องค์ยืน) คลองเขื่อน",
          dates: "ปี 2570 ยังไม่ประกาศ (ปี 2569 จัด 19 ก.ย.)",
          description: "ปี 2569 มีงานบูชาพระพิฆเนศช่วงคเณศจตุรถี ยังไม่พบรายละเอียดกำหนดการ เช็กกับอุทยานก่อนไป",
          sources: ["https://travel.trueid.net/detail/6eaWB9vOQlZp"]
        }
      ],
      faq: [
        {
          q: "วันคเณศจตุรถี 2570 ตรงกับวันไหน",
          a: "วันเสาร์ที่ 4 ก.ย. 2570 ตาม Drik Panchang ที่คำนวณสำหรับกรุงเทพฯ ฤกษ์บูชาช่วงเที่ยงคือ 11.03-13.31 น. ส่วนวันลอยองค์ (วิสรชัน) คือ 14 ก.ย. 2570",
          source: "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          q: "ทำไมวันนี้ห้ามมองพระจันทร์",
          a: "ตามความเชื่อ ถ้ามองพระจันทร์ระหว่างทิถีจตุรถีจะต้องมิถยาโทษ คือถูกกล่าวหาเรื่องที่ไม่ได้ทำ เหมือนตำนานที่พระกฤษณะถูกกล่าวหาว่าขโมยแก้วสยมันตกะ",
          source: "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          q: "พระพิฆเนศที่บ้านต้องนำไปลอยน้ำไหม",
          a: "ไม่ต้อง การลอยน้ำทำกับองค์ดินที่ปั้นขึ้นบูชาเฉพาะเทศกาล เทวรูปประจำบ้านบูชาเสร็จแล้วอัญเชิญกลับขึ้นหิ้งตามเดิม",
          source: "https://www.sanook.com/horoscope/261031/"
        },
        {
          q: "ไปร่วมงานที่ไหนได้บ้าง",
          a: "ปีที่แล้วมีพิธีที่วัดแขก สีลม เทวาลัยพระพิฆเนศ ห้วยขวาง และอุทยานพระพิฆเนศ คลองเขื่อน ฉะเชิงเทรา ปี 2570 ยังไม่ประกาศ เช็กเพจของแต่ละที่ก่อนไป",
          source: "https://travel.trueid.net/detail/6eaWB9vOQlZp"
        }
      ],
      sources: [
        "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1609350&year=2027",
        "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesh-chaturthi-date-time.html?geoname-id=1609350&year=2026",
        "https://dekhopanchang.com/en/festivals/ganesh-chaturthi/2027",
        "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981",
        "https://travel.trueid.net/detail/6eaWB9vOQlZp",
        "https://mthai.com/ganesha/418408.html",
        "https://www.sanook.com/horoscope/261031/",
        "https://www.bangkokbiznews.com/lifestyle/judprakai/1143440",
        "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt",
        "https://th.wikipedia.org/wiki/คเณศจตุรถี",
        "https://en.wikipedia.org/wiki/Ganesha"
      ]
    }
  },
  {
    slug: "thaipusam",
    name: "ไทปูซัม (ไทปูสัม)",
    tagline: "ไทปูซัม 2570 วันบูชาพระขันธกุมาร วันไหน ความหมาย พิธีวัดแขก สีลม และงานถ้ำบาตู",
    seoTitle: "วันบูชาพระขันธกุมาร วันไหน พิธีวัดแขก และถ้ำบาตู",
    goals: ["protection"],
    placeFilter: { deity: "family:hindu" },
    featureDays: 30,
    dates: [
      {
        year: 2027,
        start: "2027-01-22",
        end: "2027-01-22",
        notes: "ศุกร์ 22 ม.ค. 2570 ตาม Drik Panchang คำนวณสำหรับกรุงเทพฯ (ฤกษ์ปูสัม 11.54 น. 22 ม.ค. - 09.01 น. 23 ม.ค.) ตรงกับวันหยุดไทปูซัม 2570 ของมาเลเซีย (กัวลาลัมเปอร์ ปุตราจายา สลังงอร์ ปีนัง เปรัก เนกรีเซมบิลัน) ปี 2569 วัดแขก สีลม จัด 1 ก.พ. ตรงกับ Drik Panchang กรุงเทพฯ ปี 2570 วัดยังไม่ประกาศกำหนดการ"
      }
    ],
    content: {
      checkedAt: "2026-10-19",
      intro: "ไทปูซัม (บางที่เขียนไทปูสัม) เป็นเทศกาลของชาวฮินดูทมิฬที่ฉลองพระขันธกุมาร (มุรุกัน) โอรสของพระศิวะและพระแม่ปารวตี ตรงกับเดือนไทตามปฏิทินทมิฬ ราว ม.ค.-ก.พ. ตำนานเล่าว่าพระขันธกุมารใช้เวล (หอก) ผ่าอสูรสุรปัทมันออกเป็น 2 ส่วน ครึ่งหนึ่งกลายเป็นนกยูงที่เป็นพาหนะ อีกครึ่งเป็นไก่บนธงของพระองค์ เทศกาลนี้จึงหมายถึงชัยชนะของความดีเหนือความชั่ว งานใหญ่ที่สุดอยู่ที่ถ้ำบาตู มาเลเซีย ส่วนในไทย ปี 2569 วัดแขก สีลม มีพิธีบูชาพระขันธกุมารเนื่องในไทปูซัม ปี 2570 ตรงกับวันศุกร์ที่ 22 ม.ค. 2570",
      lunarNote: "วันไทปูซัมกำหนดจากวันที่ดาวฤกษ์ปูสัม (ปุษยะ) ตรงกับเดือนไท Drik Panchang (คำนวณสำหรับกรุงเทพฯ) ให้วันที่ 22 ม.ค. 2570 ฤกษ์ปูสัมเริ่ม 11.54 น. วันที่ 22 ม.ค. ถึง 09.01 น. วันที่ 23 ม.ค. มาเลเซียประกาศวันหยุดไทปูซัมวันที่ 22 ม.ค. 2570 เช่นกัน ปี 2569 วัดแขก สีลม จัดพิธีวันที่ 1 ก.พ. ตรงกับที่ Drik Panchang คำนวณสำหรับกรุงเทพฯ",
      rulesTitle: "ข้อควรรู้ช่วงไทปูซัม",
      rules: [
        {
          text: "ผู้ศรัทธาเตรียมตัวก่อนเทศกาลด้วยการถือศีลอด กินมังสวิรัติเท่านั้น และงดความสุขทางโลก",
          source: "https://mthai.com/rite/405703.html"
        },
        {
          text: "กาวาดี คือโครงที่ประดับขนนกยูง หนักได้ถึง 20 กก. ผู้ศรัทธาแบกเดินเป็นการเสียสละและขอบคุณที่ได้รับพร",
          source: "https://mthai.com/rite/405703.html"
        },
        {
          text: "บางคนเจาะผิวหนัง ลิ้น หรือแก้มด้วยตะขอหรือเข็ม เป็นการบำเพ็ญทุกรกิริยาของผู้ศรัทธา บางคนเดินเท้าเปล่าระยะไกลไปวัด",
          source: "https://mthai.com/rite/405703.html"
        },
        {
          text: "ปาอัล กุดัม คือการแบกหม้อนมในขบวนแห่ไปถวายพระขันธกุมาร",
          source: "https://mthai.com/rite/405703.html"
        },
        {
          text: "วัดแขก สีลม ห้ามนำของคาวเข้าบริเวณโบสถ์ และผู้หญิงที่มีประจำเดือนห้ามเข้าบริเวณโบสถ์",
          source: "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt"
        }
      ],
      sections: [
        {
          title: "ไทปูซัมที่ถ้ำบาตู มาเลเซีย",
          intro: "ถ้ำบาตูอยู่ห่างกัวลาลัมเปอร์ไปทางเหนือราว 13 กม. เป็นจุดที่คนไปร่วมไทปูซัมเยอะที่สุด",
          items: [
            {
              name: "ขบวนแห่ราชรถเงิน",
              text: "ขบวนเริ่มตอนเช้าที่วัดศรีมหามาริอัมมันในกัวลาลัมเปอร์ มีราชรถเงินหนัก 350 กก. อัญเชิญพระขันธกุมารและชายาไปพร้อมผู้ศรัทธา",
              source: "https://en.wikipedia.org/wiki/Batu_Caves"
            },
            {
              name: "บันได 272 ขั้น",
              text: "ทางขึ้นถ้ำวัดหลักเป็นบันไดคอนกรีต 272 ขั้น สร้างแทนบันไดไม้เดิมเมื่อปี 2483",
              source: "https://en.wikipedia.org/wiki/Batu_Caves"
            },
            {
              name: "รูปปั้นพระขันธกุมาร",
              text: "สูงราว 42.7 เมตร เปิดเมื่อ ม.ค. 2549",
              source: "https://en.wikipedia.org/wiki/Batu_Caves"
            },
            {
              name: "สิงคโปร์ก็มีขบวนแห่",
              text: "ขบวนเดินราว 4 กม. จากวัดศรีศรีนิวาสเปรุมาลไปวัดศรีเถณฑายุธปาณิ",
              source: "https://mthai.com/rite/405703.html"
            }
          ]
        }
      ],
      venues: [
        {
          name: "พิธีบูชาพระขันธกุมาร (Thai Poosam) วัดแขก สีลม",
          province: "กรุงเทพมหานคร",
          placeName: "วัดพระศรีมหาอุมาเทวี (วัดแขก สีลม) เขตบางรัก",
          dates: "ปี 2570 ยังไม่ประกาศ (ปี 2569 จัดวันอาทิตย์ 1 ก.พ. พิธีเย็น 17.30 น.)",
          description: "ปฏิทินพิธีของวัดปี 2569 มีพิธีบูชาองค์พระขันธกุมารเนื่องในไทปูซัม เริ่มพิธีบูชาเย็น 17.30 น.",
          sources: ["https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"]
        },
        {
          name: "ไทปูซัม ถ้ำบาตู",
          province: "ใกล้กัวลาลัมเปอร์ มาเลเซีย",
          placeName: "ถ้ำบาตู (Batu Caves)",
          dates: "22 ม.ค. 2570 (วันหยุดไทปูซัมของมาเลเซีย)",
          description: "งานไทปูซัมใหญ่ที่สุดนอกอินเดีย ขบวนแห่จากวัดศรีมหามาริอัมมันในกัวลาลัมเปอร์ไปถ้ำบาตู ผู้ศรัทธาแบกกาวาดีและหม้อนมขึ้นบันได 272 ขั้น",
          sources: [
            "https://en.wikipedia.org/wiki/Batu_Caves",
            "https://mthai.com/rite/405703.html",
            "https://www.humanresourcesonline.net/malaysia-s-2027-public-holidays-full-list-of-federal-and-state-holidays"
          ]
        }
      ],
      faq: [
        {
          q: "ไทปูซัม 2570 ตรงกับวันไหน",
          a: "วันศุกร์ที่ 22 ม.ค. 2570 ตาม Drik Panchang ที่คำนวณสำหรับกรุงเทพฯ และตรงกับวันหยุดไทปูซัมของมาเลเซีย",
          source: "https://www.drikpanchang.com/festivals/thaipusam/tamil-thaipusam-date.html?geoname-id=1609350&year=2027"
        },
        {
          q: "ไทปูซัมฉลองอะไร",
          a: "ฉลองพระขันธกุมาร โอรสของพระศิวะและพระแม่ปารวตี ที่ใช้เวลปราบอสูรสุรปัทมัน หมายถึงความดีชนะความชั่ว",
          source: "https://mthai.com/rite/405703.html"
        },
        {
          q: "ในไทยไปร่วมพิธีได้ที่ไหน",
          a: "ปี 2569 วัดแขก สีลม มีพิธีบูชาพระขันธกุมารเนื่องในไทปูซัม เริ่ม 17.30 น. ปี 2570 ยังไม่ประกาศ เช็กเพจของวัดก่อนไป",
          source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
        },
        {
          q: "ถ้ำบาตูขึ้นกี่ขั้น",
          a: "272 ขั้น ถ้ำอยู่ห่างกัวลาลัมเปอร์ไปทางเหนือราว 13 กม.",
          source: "https://en.wikipedia.org/wiki/Batu_Caves"
        }
      ],
      sources: [
        "https://www.drikpanchang.com/festivals/thaipusam/tamil-thaipusam-date.html?geoname-id=1609350&year=2027",
        "https://www.drikpanchang.com/festivals/thaipusam/tamil-thaipusam-date.html?geoname-id=1609350&year=2026",
        "https://www.humanresourcesonline.net/malaysia-s-2027-public-holidays-full-list-of-federal-and-state-holidays",
        "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981",
        "https://mthai.com/rite/405703.html",
        "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt",
        "https://en.wikipedia.org/wiki/Batu_Caves"
      ]
    }
  },
  {
    slug: "vasant-panchami",
    name: "วสันตปัญจมี",
    tagline: "วสันตปัญจมี 2570 วันบูชาพระแม่สรัสวตี ขอพรการเรียน วันไหน ใส่สีอะไร และไหว้ที่ไหน",
    seoTitle: "วันบูชาพระแม่สรัสวตี ขอพรการเรียน วันไหน และไหว้ที่ไหน",
    goals: ["study"],
    placeFilter: { deity: "family:hindu" },
    featureDays: 30,
    dates: [
      {
        year: 2027,
        start: "2027-02-11",
        end: "2027-02-11",
        notes: "พฤหัสบดี 11 ก.พ. 2570 ตาม Drik Panchang คำนวณสำหรับกรุงเทพฯ (ทิถีปัญจมี 04.34 น. 11 ก.พ. - 04.48 น. 12 ก.พ.) ตรงกับ Dekho Panchang (อ้างอิงเดลี นับตามทิถีตอนพระอาทิตย์ขึ้น) ยังไม่พบประกาศพิธีของวัดหรือเทวาลัยในไทย"
      }
    ],
    content: {
      checkedAt: "2026-10-19",
      intro: "วสันตปัญจมี หรือสรัสวตีบูชา คือวันบูชาพระแม่สรัสวตี (สุรัสวดี) ชายาของพระพรหม เทพีแห่งปัญญา ความรู้ ดนตรี และศิลปะ ตรงกับวันขึ้น 5 ค่ำ เดือนมาฆะตามปฏิทินฮินดู ราวปลาย ม.ค.-ก.พ. และเป็นวันต้อนรับฤดูใบไม้ผลิ ในอินเดียและเนปาล ผู้ปกครองพาลูกหลานไปทำพิธีที่วัด และให้เด็กเล็กเริ่มเขียนคำแรก ถือเป็นจุดเริ่มต้นของการเรียน ปี 2570 ตรงกับวันพฤหัสบดีที่ 11 ก.พ. 2570",
      lunarNote: "Drik Panchang (คำนวณสำหรับกรุงเทพฯ) ให้ทิถีปัญจมีเริ่ม 04.34 น. วันที่ 11 ก.พ. ถึง 04.48 น. วันที่ 12 ก.พ. 2570 ฤกษ์บูชาวสันตปัญจมี 06.43-12.32 น. วันที่ 11 ก.พ. Dekho Panchang (อ้างอิงเดลี) ก็ให้วันที่ 11 ก.พ. ตรงกัน ปีที่แล้ว (2569) ตรงกับ 23 ม.ค.",
      rulesTitle: "ข้อควรรู้วันวสันตปัญจมี",
      rules: [
        {
          text: "ชาวฮินดูนิยมใส่เสื้อผ้าสีเหลืองไปบูชาพระแม่สรัสวตี",
          source: "https://mthai.com/horoscope/auspices/404528.html"
        },
        {
          text: "สีเหลืองมาจากดอกมัสตาร์ดที่บานช่วงนี้ หลายบ้านกินอาหารสีเหลืองด้วย",
          source: "https://en.wikipedia.org/wiki/Vasant_Panchami"
        },
        {
          text: "ก่อนสวดบูชาพระแม่สรัสวตี ให้สวดบูชาพระพิฆเนศก่อนเสมอ",
          source: "https://mthai.com/horoscope/auspices/404528.html"
        },
        {
          text: "บูชาช่วงเช้าถึงเที่ยงตามฤกษ์ ที่กรุงเทพฯ คือ 06.43-12.32 น. วันที่ 11 ก.พ. 2570",
          source: "https://www.drikpanchang.com/festivals/vasant-panchami/vasant-panchami-puja-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          text: "ไปวัดแขก สีลม ห้ามนำของคาวเข้าบริเวณโบสถ์ และผู้หญิงที่มีประจำเดือนห้ามเข้าบริเวณโบสถ์",
          source: "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt"
        }
      ],
      sections: [
        {
          title: "ธรรมเนียมวันวสันตปัญจมี",
          items: [
            {
              name: "เด็กเริ่มเขียนคำแรก",
              text: "ครอบครัวชวนเด็กเล็กเขียนคำแรก หรือเรียนและเล่นดนตรีด้วยกัน ถือเป็นวันเริ่มต้นการศึกษา (วิทยารัมภะ)",
              source: "https://en.wikipedia.org/wiki/Vasant_Panchami"
            },
            {
              name: "โรงเรียนจัดพิธีบูชา",
              text: "โรงเรียนและมหาวิทยาลัยในอินเดียหลายแห่งจัดพิธีบูชาตอนเช้าเพื่อขอพรให้นักเรียน",
              source: "https://en.wikipedia.org/wiki/Vasant_Panchami"
            },
            {
              name: "เนปาล แต้มติกะแดงให้นักเรียน",
              text: "ผู้ปกครองพาลูกไปทำพิธีที่วัด เด็ก ๆ ขีดเขียนบนกำแพงวัด และโรงเรียนแต้มติกะแดงให้นักเรียน",
              source: "https://www.thaipbs.or.th/program/LokLakMiti/episodes/86770"
            }
          ]
        }
      ],
      venues: [
        {
          name: "ไหว้พระแม่สรัสวตี วัดแขก สีลม",
          province: "กรุงเทพมหานคร",
          placeName: "วัดพระศรีมหาอุมาเทวี (วัดแขก สีลม) เขตบางรัก",
          description: "หนึ่งในที่ไหว้พระแม่สรัสวตีที่ MThai แนะนำ ปฏิทินพิธีของวัดปี 2569 ไม่มีพิธีวันวสันตปัญจมี (วัดบูชาพระแม่สรัสวตีช่วงคืนท้าย ๆ ของนวราตรี) ไปไหว้ได้ตามเวลาเปิดวัด",
          sources: [
            "https://mthai.com/horoscope/auspices/404528.html",
            "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
          ]
        },
        {
          name: "ศาลพระแม่สุรัสวดี ศูนย์สิริกิติ์",
          province: "กรุงเทพมหานคร",
          placeName: "ศูนย์การประชุมแห่งชาติสิริกิติ์",
          description: "หนึ่งในที่ไหว้พระแม่สรัสวตีที่ MThai แนะนำ ยังไม่พบประกาศพิธีวันวสันตปัญจมี 2570",
          sources: ["https://mthai.com/horoscope/auspices/404528.html"]
        },
        {
          name: "วัดเทพมณเฑียร (สมาคมฮินดูสมาช)",
          province: "กรุงเทพมหานคร",
          placeName: "วัดเทพมณเฑียร",
          description: "หนึ่งในที่ไหว้พระแม่สรัสวตีที่ MThai แนะนำ ยังไม่พบประกาศพิธีวันวสันตปัญจมี 2570",
          sources: ["https://mthai.com/horoscope/auspices/404528.html"]
        }
      ],
      faq: [
        {
          q: "วสันตปัญจมี 2570 ตรงกับวันไหน",
          a: "วันพฤหัสบดีที่ 11 ก.พ. 2570 ตาม Drik Panchang ที่คำนวณสำหรับกรุงเทพฯ ฤกษ์บูชา 06.43-12.32 น.",
          source: "https://www.drikpanchang.com/festivals/vasant-panchami/vasant-panchami-puja-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          q: "วันนี้ขอพรเรื่องอะไรดี",
          a: "พระแม่สรัสวตีเป็นเทพีแห่งความรู้ ดนตรี และศิลปะ คนจึงนิยมขอพรเรื่องการเรียน และถือเป็นวันเริ่มต้นการศึกษาของเด็ก",
          source: "https://www.thaipbs.or.th/program/LokLakMiti/episodes/86770"
        },
        {
          q: "ใส่สีอะไรไปไหว้",
          a: "สีเหลือง ตามธรรมเนียมชาวฮินดูในวันนี้",
          source: "https://mthai.com/horoscope/auspices/404528.html"
        },
        {
          q: "มีงานที่วัดในไทยไหม",
          a: "ยังไม่พบประกาศพิธีวันวสันตปัญจมีของวัดหรือเทวาลัยในไทย ปฏิทินวัดแขก สีลม ปี 2569 ก็ไม่มีพิธีนี้ ไปไหว้พระแม่สรัสวตีได้ตามเวลาเปิดของแต่ละที่",
          source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
        }
      ],
      sources: [
        "https://www.drikpanchang.com/festivals/vasant-panchami/vasant-panchami-puja-date-time.html?geoname-id=1609350&year=2027",
        "https://dekhopanchang.com/en/festivals/vasant-panchami/2027",
        "https://mthai.com/horoscope/auspices/404528.html",
        "https://www.thaipbs.or.th/program/LokLakMiti/episodes/86770",
        "https://en.wikipedia.org/wiki/Vasant_Panchami",
        "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981",
        "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt"
      ]
    }
  },
  {
    slug: "maha-shivaratri",
    name: "มหาศิวราตรี",
    tagline: "มหาศิวราตรี 2570 คืนบูชาพระศิวะ วันไหน ของถวาย วิธีบูชา และพิธีตลอดคืนวัดแขก สีลม",
    seoTitle: "คืนบูชาพระศิวะ วันไหน ของถวาย และพิธีวัดแขกสีลม",
    goals: ["love", "family", "protection"],
    placeFilter: { deity: "family:hindu" },
    featureDays: 30,
    dates: [
      {
        year: 2027,
        start: "2027-03-06",
        end: "2027-03-06",
        notes: "เสาร์ 6 มี.ค. 2570 บูชาตลอดคืนถึงเช้า 7 มี.ค. ตาม Drik Panchang คำนวณสำหรับกรุงเทพฯ (ทิถีจตุรทศี 13.33 น. 6 มี.ค. - 15.16 น. 7 มี.ค., นิศิถกาล 00.05-00.53 น.) ตรงกับ Dekho Panchang (อ้างอิงเดลี) ปี 2569 วัดแขก สีลม จัด 15 ก.พ. ตรงกับ Drik Panchang กรุงเทพฯ ปี 2570 วัดยังไม่ประกาศกำหนดการ"
      }
    ],
    content: {
      checkedAt: "2026-10-19",
      intro: "มหาศิวราตรี แปลว่าราตรีอันยิ่งใหญ่ของพระศิวะ ผู้ศรัทธาอดอาหาร สวดมนต์ และเฝ้าบูชาตลอดคืน มีหลายตำนาน เช่น เป็นคืนวิวาห์ของพระศิวะกับพระแม่ปารวตี คืนที่พระศิวะร่ายรำตาณฑพ ตำนานพระศิวะดื่มยาพิษเพื่อช่วยโลก และตำนานพระศิวะปรากฏเป็นเสาไฟที่ไม่มีที่สิ้นสุด ในไทย ปี 2569 วัดแขก สีลม จัดพิธีบูชาตลอดคืน ปี 2570 ตรงกับคืนวันเสาร์ที่ 6 มี.ค. ต่อเนื่องถึงเช้าวันที่ 7 มี.ค. 2570",
      lunarNote: "มหาศิวราตรีตรงกับแรม 14 ค่ำ (ทิถีจตุรทศี) ก่อนเดือนดับ Drik Panchang (คำนวณสำหรับกรุงเทพฯ) ให้ทิถีจตุรทศีเริ่ม 13.33 น. วันที่ 6 มี.ค. ถึง 15.16 น. วันที่ 7 มี.ค. 2570 ช่วงบูชาสำคัญกลางดึก (นิศิถกาล) คือ 00.05-00.53 น. ของคืนวันที่ 6 ต่อ 7 มี.ค. และออกบวช (ปารณะ) ได้วันที่ 7 มี.ค. 06.31-15.16 น. Dekho Panchang (อ้างอิงเดลี) ก็ให้วันที่ 6 มี.ค. ตรงกัน ปี 2569 วัดแขก สีลม จัดพิธีวันที่ 15 ก.พ. ตรงกับที่ Drik Panchang คำนวณสำหรับกรุงเทพฯ",
      rulesTitle: "วิธีบูชาคืนมหาศิวราตรี",
      rules: [
        {
          text: "ผู้ศรัทธาอดอาหาร สวดมนต์ และเฝ้าบูชาตลอดคืน",
          source: "https://www.nationalgeographic.com/culture/article/maha-shivaratri-shiva-hindu"
        },
        {
          text: "สรงศิวลึงค์ด้วยนมและน้ำผึ้ง พร้อมสวด โอม นมะ ศิวายะ",
          source: "https://www.nationalgeographic.com/culture/article/maha-shivaratri-shiva-hindu"
        },
        {
          text: "ถวายใบมะตูม (พิลวะ) และพุทรา จุดประทีป และทำสมาธิ",
          source: "https://www.nationalgeographic.com/culture/article/maha-shivaratri-shiva-hindu"
        },
        {
          text: "คนที่อดอาหาร ออกบวชเช้าวันที่ 7 มี.ค. 2570 ช่วง 06.31-15.16 น. (เวลากรุงเทพฯ)",
          source: "https://www.drikpanchang.com/festivals/maha-shivaratri/maha-shivaratri-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          text: "วัดแขก สีลม ห้ามนำของคาวเข้าบริเวณโบสถ์ และผู้หญิงที่มีประจำเดือนห้ามเข้าบริเวณโบสถ์",
          source: "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt"
        }
      ],
      sections: [
        {
          title: "พิธีตลอดคืนที่วัดแขก สีลม (ตามกำหนดการปี 2569)",
          style: "steps",
          intro: "ปี 2569 วัดแขกจัดวันที่ 15 ก.พ. ใช้เป็นแนวทางได้ ปี 2570 รอวัดประกาศ",
          items: [
            {
              name: "17.30 น. พิธีบูชาเย็น",
              text: "เริ่มพิธีมหาศิวราตรี",
              source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
            },
            {
              name: "20.00 น. บูชารอบที่ 1",
              text: "พิธีบูชาพระศิวะต่อเนื่องตลอดคืน",
              source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
            },
            {
              name: "23.00 น. บูชารอบที่ 2",
              text: "รอบกลางดึก",
              source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
            },
            {
              name: "02.00 น. บูชารอบที่ 3",
              text: "รอบหลังเที่ยงคืน",
              source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
            },
            {
              name: "05.00 น. บูชารอบที่ 4",
              text: "รอบสุดท้ายก่อนรุ่งเช้า",
              source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
            }
          ]
        }
      ],
      venues: [
        {
          name: "มหาศิวราตรี วัดแขก สีลม",
          province: "กรุงเทพมหานคร",
          placeName: "วัดพระศรีมหาอุมาเทวี (วัดแขก สีลม) เขตบางรัก",
          dates: "ปี 2570 ยังไม่ประกาศ (ปี 2569 จัดวันอาทิตย์ 15 ก.พ. ตั้งแต่ 17.30 น. ถึงเช้า)",
          description: "พิธีบูชาพระศิวะตลอดคืน เริ่มพิธีเย็น 17.30 น. แล้วบูชาเป็นรอบ 20.00 23.00 02.00 และ 05.00 น.",
          sources: ["https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"]
        }
      ],
      faq: [
        {
          q: "มหาศิวราตรี 2570 วันไหน",
          a: "คืนวันเสาร์ที่ 6 มี.ค. 2570 ต่อเนื่องถึงเช้าวันที่ 7 มี.ค. ตาม Drik Panchang ที่คำนวณสำหรับกรุงเทพฯ ช่วงบูชาสำคัญกลางดึกคือ 00.05-00.53 น.",
          source: "https://www.drikpanchang.com/festivals/maha-shivaratri/maha-shivaratri-date-time.html?geoname-id=1609350&year=2027"
        },
        {
          q: "ถวายอะไรพระศิวะดี",
          a: "นมและน้ำผึ้งสำหรับสรงศิวลึงค์ ใบมะตูม และพุทรา พร้อมจุดประทีปและสวด โอม นมะ ศิวายะ",
          source: "https://www.nationalgeographic.com/culture/article/maha-shivaratri-shiva-hindu"
        },
        {
          q: "คืนนี้ขอพรเรื่องอะไร",
          a: "เพราะเป็นคืนวิวาห์ของพระศิวะกับพระแม่ปารวตี ในเนปาลผู้หญิงจึงถือศีลอดขอพรให้พบเนื้อคู่ และให้สามีสุขภาพดีอายุยืน",
          source: "https://www.thaipbs.or.th/program/LokLakMiti/episodes/86770"
        },
        {
          q: "ต้องอยู่ทั้งคืนไหม",
          a: "การเฝ้าบูชาตลอดคืนเป็นธรรมเนียมของผู้ศรัทธา ที่วัดแขกปี 2569 แบ่งพิธีเป็นรอบ 20.00 23.00 02.00 และ 05.00 น. หลังพิธีเย็น 17.30 น.",
          source: "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981"
        }
      ],
      sources: [
        "https://www.drikpanchang.com/festivals/maha-shivaratri/maha-shivaratri-date-time.html?geoname-id=1609350&year=2027",
        "https://www.drikpanchang.com/festivals/maha-shivaratri/maha-shivaratri-date-time.html?geoname-id=1609350&year=2026",
        "https://dekhopanchang.com/en/festivals/maha-shivaratri/2027",
        "https://www.pptvhd36.com/news/%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C/268981",
        "https://www.nationalgeographic.com/culture/article/maha-shivaratri-shiva-hindu",
        "https://www.thaipbs.or.th/program/LokLakMiti/episodes/86770",
        "https://www.ktc.co.th/article/travel-guide/thailand/bangkok-temple-near-bts-mrt"
      ]
    }
  }
];
