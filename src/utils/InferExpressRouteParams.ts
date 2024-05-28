type InferExpressRouteParams<T extends string> = 
string extends T ? { [key: string]: string } :
T extends `${infer _Start}:${infer Param}?/${infer Rest}`
  ? { [k in Param]?: string } & InferExpressRouteParams<Rest> :
T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [k in Param]: string } & InferExpressRouteParams<Rest> :
T extends `${infer _Start}:${infer Param}?`
  ? { [k in Param]?: string } :
T extends `${infer _Start}:${infer Param}`
  ? { [k in Param]: string } :
{};

export default InferExpressRouteParams