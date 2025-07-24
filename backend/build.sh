pip install -r requirements.txt
# migrate changes
python manage.py migrate
python manage.py collectstatic --noinput