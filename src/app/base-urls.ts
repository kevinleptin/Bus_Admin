export class BaseUrls {

  public static readonly BASE_HREF: string = "http://ec2-44-212-14-160.compute-1.amazonaws.com:8080";

  public static readonly ADMIN_GROUPURL: string = "admin";
  public static readonly USER_GROUPURL: string = "users";
  public static readonly BUS_ROUTES_GROUPURL: string = "bus-routes";
  public static readonly ROUTE_STOPS_GROUPURL: string = "route-stops";
  public static readonly VEHICLES_GROUPURL: string = "vehicles";
  public static readonly BUS_PASS_GROUPURL: string = "bus-pass";
  public static readonly FEEDBACK_GROUPURL: string = "feedback";

  public static getUrl(key: string): string { return `${this.BASE_HREF}/${key}/get`;}
  public static getAddUrl(key: string): string { return `${this.BASE_HREF}/${key}/add`;}
  public static getUpdateUrl(key: string): string { return `${this.BASE_HREF}/${key}/update`;}
  public static getDeleteUrl(key: string): string { return `${this.BASE_HREF}/${key}/delete`;}
  public static getLoginUrl(key: string): string { return `${this.BASE_HREF}/${key}/login`;}
  
}
