const createEmail = () => {
    return `
            <table bgcolor="#F2F2F2" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                    <tr>
                        <td>
                            <div style="max-width:600px;margin:50px auto;font-size:16px;line-height:24px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table border="0" cellpadding="0" cellspacing="0" class="m_5803932240869802006card-box m_5803932240869802006first" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <table border="0" cellpadding="0" cellspacing="0" class="m_5803932240869802006card-box" width="100%">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="background-color:white;padding-top:30px;padding-bottom:30px">
                                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td align="left" style="padding-top:0;padding-bottom:20px;padding-left:30px">
                                                                                                <a href="javascript:void(0)" target="_blank">
                                                                                                    <img src='https://i.ibb.co/gvqpMhK/Flexscale-Logo.png' alt="FlexScale" width="150"style="vertical-align:middle"class="CToWUd"data-bit="iit"> 
                                                                                                </a> 
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="m_5803932240869802006card-row" style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;word-break:break-word;padding-left:30px;padding-right:30px;padding-top:20px;padding-bottom:10px;margin-left:0px;margin-right:0px">
                                                                                                <h3 style="margin-top:0;margin-bottom:0;font-family:Helvetica,sans-serif;font-weight:700;font-size:32px;line-height:40px;color:#000000">
                                                                                                    %HEADING%
                                                                                                </h3>
                                                                                                <h4 style="margin-top:0px;margin-bottom:0;font-family:Helvetica,sans-serif;font-weight:400;font-size:16px;line-height:26px;color:#BABABA">
                                                                                                    %SUBHEADING%
                                                                                                </h4>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="m_5803932240869802006card-row" style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;word-break:break-word;padding-left:30px;padding-right:30px;padding-top:10px;color: #000000DE;">
                                                                                                %DESCRIPTION%
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="m_5803932240869802006card-row" style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;word-break:break-word;padding-left:30px;padding-right:30px;padding-top:30px;padding-bottom:20px;margin-left:0px;margin-right:0px">
                                                                                                <a href="%LINK%" style="background-color: #203B3C;color: #fff;padding: 14px 23px;font-size: 17px;border-radius: 30px;text-decoration: none;">%LINKTEXT%</a>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="m_5803932240869802006card-row" style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;word-break:break-word;padding-left:30px;padding-right:30px;padding-top:30px;margin-left:0px;margin-right:0px">
                                                                                                <hr style="border-color: #f7f7f72b;"/>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td align="left" width="100%" style="color:#BABABA;font-size:12px;line-height:24px;padding-bottom: 0px;padding-top: 0;padding-left:30px;padding-right:30px;">
                                                                                                <a href="#" style="color:#BABABA;text-decoration:none" target="_blank">
                                                                                                    Flexscale LLC</a> &nbsp; | &nbsp; <a
                                                                                                    href="#"
                                                                                                    style="color:#BABABA;text-decoration:underline" target="_blank">
                                                                                                    flexscale.com
                                                                                                    </a>
                                                                                                <div style="padding-top: 15px;font-family:Helvetica,Arial,sans-serif;word-break:normal;color:#BABABA;" class="m_5803932240869802006address-link" >
                                                                                                    8 The Green Ste A Dover, Delaware 19901 USA
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
    `;
}

export const getTemplate = (prop) => {
    var emailTempDesign = createEmail();
    emailTempDesign = emailTempDesign.replace(/%HEADING%/g, prop?.heading);
    emailTempDesign = emailTempDesign.replace(/%SUBHEADING%/g, prop?.subheading);
    emailTempDesign = emailTempDesign.replace(/%DESCRIPTION%/g, prop?.description);
    emailTempDesign = emailTempDesign.replace(/%LINK%/g, prop?.link);
    emailTempDesign = emailTempDesign.replace(/%LINKTEXT%/g, prop?.linktext);
    return emailTempDesign;
}