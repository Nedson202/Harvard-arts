export = index;
declare function index(format: any, options: any): any;
declare namespace index {
  const combined: string;
  const common: string;
  function compile(format: any): any;
  function date(req: any, res: any, format: any): any;
  function dev(tokens: any, req: any, res: any): any;
  function format(name: any, fmt: any): any;
  function method(req: any): any;
  function referrer(req: any): any;
  function req(req: any, res: any, field: any): any;
  function res(req: any, res: any, field: any): any;
  const short: string;
  function status(req: any, res: any): any;
  const tiny: string;
  function token(name: any, fn: any): any;
  function url(req: any): any;
}
