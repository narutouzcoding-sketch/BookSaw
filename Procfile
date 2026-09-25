# Procfile — PaaS deployment (Render, Railway, Heroku)
# Gunicorn WSGI server bilan Django ishga tushiriladi.
# Deploy paytida avtomatik collectstatic va migrate bajariladi.

release: cd backend && python manage.py migrate --noinput && python manage.py collectstatic --noinput
web: cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120
