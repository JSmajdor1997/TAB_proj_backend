# API documentation

## General info

return type of all requests is as follows

```typescript
type  APIResponse<DataType,  ErrorType  extends  string  |  number>  = {
	data:  {
		data:  DataType,
		message?: string
		error?: never
	}  |  {
		data?: never
		error:  {
			customCode:  ErrorType
			message?: string
		}
}
```



All mutating and creating requests return new data

## Requests list
### data types
```typescript
	interface UserInsert { 
	
	} 

	interface ClientUser { 

	} 

	interface UserInsert { 

	} 

	interface UserQuery { 
		phrase?: string //queried fields: User::email, User::name, User::surname, if no query provided users are returned as sorted by id 		
		range: { //indices of returned slice - to be use for pagination 
			from: integer 
			to: integer 
		} 
	}

	enum SettingPasswordError {
		InvalidOldPasswordProvided = 0
	}

	enum LoginError {
		UserAlreadyLoggedIn = 0,
		UserDoesNotExistOrInvalidPassword=1
	}

	enum UserType {
		Librarian = 0,
		Student = 1
	}
```
### User related requests
| Path                 | Method | Auth      | Body Params                                | Query Params | Return type - Data | Return type - Error | Description                                           |
|----------------------|--------|-----------|--------------------------------------------|--------------|--------------------|---------------------|-------------------------------------------------------|
| /user/login          | POST   | Librarian | {email: string, password: string, userType: UserType}          | -            | string             | LoginError          | starts authorized session if provided auth is correct, for login as either student or librarian |
| /user/logout         | POST   | Librarian | -                                          | -            | string             | LogoutError         | stops existing authorized sessions if any             |
| /user/reset-password | POST   | Librarian | -                                          | -            |                    | -                   | ToDo                                                  |
| /user/set-password   | POST   | Librarian | {oldPassword: string, newPassword: string} | -            |                    | -                   | ToDo                                                  |

### Book_items related requests
| Path               | Method | Auth | Body params | Query params | Return type - Data | Return type - Error | Description |
|--------------------|--------|------|-------------|--------------|--------------------|---------------------|-------------|
| /book-items/lend   |        |      |             |              |                    |                     | ToDo        |
| /book-items/return |        |      |             |              |                    |                     | ToDo        |

### Messages related requests
| Path               | Method | Auth | Body params | Query params | Return type - Data | Return type - Error | Description |
|--------------------|--------|------|-------------|--------------|--------------------|---------------------|-------------|
| /messages/get   |        |      |             |              |                    |                     | ToDo        |
| /messages/send |        |      |             |              |                    |                     | ToDo        |
| /messages/changes-channel |        |      |             |              |                    |                     | ToDo        |

### Reports related requests
| Path               | Method | Auth | Body params | Query params | Return type - Data | Return type - Error | Description |
|--------------------|--------|------|-------------|--------------|--------------------|---------------------|-------------|
| /report/request-creation   |        |      |             |              |                    |                     | ToDo        |
| /report/get-all-generated |        |      |             |              |                    |                     | ToDo        |
| /user//report/download |        |      |             |              |                    |                     | ToDo        |




## HTTP status codes
below are listed all status codes used by server

| Code | Name                    | Description                                                 |
|------|-------------------------|-------------------------------------------------------------|
| 200  | OK                      | provided params are correct, request performed successfully |
| 400  | ClientErrorBadRequest   | provided params are missing and / or incorrect              |
| 401  | ClientErrorUnauthorized | request require authorization, log in!                      |
| 500  | ServerErrorInternal     | internal server error                                       |

  

## Usage/Examples

```typescript
	async function demo() {
		const loginResult = await fetch("https://127.0.0.1:3000/user/login", {
			method: "POST",
			body: JSON.stringify({
				email: "admin@admin.pl",
				password: "zaq1@WSX"
			})
		}).then(it => it.json())

		if(loginResult.error != null) {
			console.log(loginResult)
		} else {
			const logoutResult = fetch("https://127.0.0.1:3000/user/logout", {
				method: "POST",
			}).then(it => it.json())

			console.log(logoutResult)
		}
	}
	
	demo()
```

## Deyplyment instructions
1. download repository
2. run ```npm install```
3. create .env file with entries (example below):
```bash
#port on which server is accessible
PORT=3000

#database connection parameters, may be ommited if NODE_ENV set to development (uses :memory: DB)
DATABASE_URL=postgres://user:password@host:port/db
DATABASE_PORT=4336
DATABASE_NAME=app_db
DATABASE_USER_NAME=user_name
DATABASE_USER_PASSWORD=password

#either 'development' or 'production'
#'development' mode uses :memory: DB, enables verbose logs, creates default librarian account, when in production change to 'production'!
NODE_ENV=development

#path to folder containing migration scripts generated from src/DB/schema/* files
#to generate new migration scripts run ```bash npm run migrate```
MIGRATION_CATALOG=migration

#access token
SECRET_ACCESS_TOKEN=XXXXXX-YYYYYY-ZZZZZ...

#https certificate and key
HTTPS_CERT=https/cert.pem
HTTPS_KEY=https/key.pem
```
4. run ```npm run dev```


## Authors
- [@JSmajdor1997](https://www.github.com/JSmajdor1997)
