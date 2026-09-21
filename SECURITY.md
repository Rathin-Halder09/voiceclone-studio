# Security

## Security Principles

1. **Never expose secrets in frontend code** - All API keys and credentials are stored in environment variables
2. **Consent before data collection** - Users must explicitly confirm voice ownership
3. **Data minimization** - Only collect what's necessary
4. **Secure deletion** - Complete removal when requested
5. **Input validation** - All inputs are validated before processing

## API Key Management

- API keys are stored in `.env` (never committed to git)
- `.env.example` is committed (contains no real secrets)
- In production, use server-side environment variables or secret managers
- Never log API keys or tokens

## Data Protection

### Voice Recordings
- Treated as sensitive biometric-like data
- Processed locally in the browser when possible
- Encrypted in transit (HTTPS) when sent to cloud providers
- Deleted permanently upon user request

### Voice Profiles
- Stored with unique internal IDs
- No raw audio stored in profile metadata
- Can be deleted independently of recordings

### Generated Audio
- Stored locally in browser memory
- Downloadable by the user
- Deletable at any time

## Authentication & Authorization

When using cloud providers:
- Use OAuth 2.0 or API key authentication
- Implement rate limiting
- Validate all requests server-side
- Use CORS restrictions in production

## File Upload Security

- File type validation (audio/* only)
- Maximum file size: 50MB
- Maximum recording duration: 10 minutes
- Reject non-audio files immediately

## Rate Limiting

- Configurable requests per minute
- Prevents abuse and accidental large requests
- Default: 30 requests per minute

## Content Security

- No user-generated content is stored on external servers without consent
- Text input is sanitized before processing
- No XSS vulnerabilities (React handles escaping)

## Production Checklist

- [ ] Remove all development credentials
- [ ] Configure proper CORS
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Use server-side proxy for API calls
- [ ] Enable request logging (without sensitive data)
- [ ] Set up monitoring and alerts
- [ ] Configure backup and recovery
- [ ] Document incident response plan
