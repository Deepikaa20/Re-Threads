from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import pymysql
import logging
import os
from werkzeug.utils import secure_filename
from flask_mysqldb import MySQL
import MySQLdb.cursors
import openai
from flask import request, jsonify
from flask import session

def get_current_user_id():
    return session.get('user_id')  # Adjust key based on your session setup


import os
openai.api_key = os.getenv("OPENAI_API_KEY")
app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # or your MySQL username
app.config['MYSQL_PASSWORD'] = 'Deepika.dhakshi2004'  # or your MySQL password
app.config['MYSQL_DB'] = 'threads'  # or your MySQL database name

mysql = MySQL(app)

app.secret_key = 'YourSecretKeyHere'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

# File upload configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, user_id):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add user_id to filename to make it unique
        name, ext = os.path.splitext(filename)
        filename = f"{name}_{user_id}{ext}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return f"/static/uploads/{filename}"
    return None

# ---------- CONFIG ----------
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Deepika.dhakshi2004',
    'database': 'threads'
}

# ---------- SETUP LOGGING ----------
logging.basicConfig(level=logging.DEBUG)

# ---------- DB CONNECTION ----------
def get_db_connection():
    try:
        conn = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database'],
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except Exception as e:
        logging.error(f"DB Connection Failed: {e}")
        return None

# ---------- INITIALIZE DATABASE ----------
def initialize_database():
    conn = get_db_connection()
    if not conn:
        return

    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('student', 'brand') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create student_profiles table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            dob DATE,
            bio TEXT,
            institution VARCHAR(255),
            program VARCHAR(255),
            major VARCHAR(255),
            year VARCHAR(50),
            student_id VARCHAR(50),
            design_types TEXT,
            other_designer_text TEXT,
            materials TEXT,
            sustainability TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    # Create brand_profiles table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS brand_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            brand_name VARCHAR(255) NOT NULL,
            website VARCHAR(255),
            brand_bio TEXT,
            contact_name VARCHAR(255),
            contact_email VARCHAR(255),
            contact_phone VARCHAR(20),
            contact_role VARCHAR(255),
            material_types TEXT,
            material_quantities TEXT,
            shipping_method VARCHAR(50),
            shipping_notes TEXT,
            logo_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    
    # Create inventory table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            brand_id INT NOT NULL,
            material_name VARCHAR(255) NOT NULL,
            material_type VARCHAR(100) NOT NULL,
            quantity INT NOT NULL,
            unit VARCHAR(50) NOT NULL,
            description TEXT,
            material_condition VARCHAR(50) NOT NULL,
            image_url VARCHAR(255),
            status ENUM('available', 'reserved', 'donated') DEFAULT 'available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (brand_id) REFERENCES brand_profiles(id)
        )
    """)
    # Create material_requests table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS material_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            brand_id INT NOT NULL,
            material_id INT NOT NULL,
            quantity_requested INT NOT NULL,
            purpose VARCHAR(100) NOT NULL,
            project_details TEXT NOT NULL,
            timeline DATE NOT NULL,
            duration VARCHAR(50) NOT NULL,
            special_requests TEXT,
            status ENUM('Pending', 'Approved', 'Rejected', 'Shipped') DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES student_profiles(id),
            FOREIGN KEY (brand_id) REFERENCES brand_profiles(id),
            FOREIGN KEY (material_id) REFERENCES inventory(id)
        )
    """)


    
    
    conn.commit()
    conn.close()

# ---------- SESSION CONFIG ----------
@app.before_request
def make_session_permanent():
    session.permanent = True

# ---------- ROUTES ----------

@app.route('/')
def home():
    return render_template('landing.html')

# ----- SIGNUP -----
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        try:
            email = request.form['email']
            password = request.form['password']
            role = request.form['user-type']
            hashed_pw = generate_password_hash(password)

            conn = get_db_connection()
            if not conn:
                flash("Database connection failed. Please try again.", "danger")
                return redirect(url_for('signup'))
                
            cursor = conn.cursor()

            try:
                cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
                            (email, hashed_pw, role))
                conn.commit()
                flash("Signup successful. Please log in.", "success")
                return redirect(url_for('signin'))
            except pymysql.err.IntegrityError:
                flash("Email already registered.", "danger")
                return redirect(url_for('signup'))
            except Exception as e:
                logging.error(f"Signup error: {e}")
                flash("An error occurred during signup. Please try again.", "danger")
                return redirect(url_for('signup'))
            finally:
                conn.close()
        except Exception as e:
            logging.error(f"Signup form error: {e}")
            flash("Invalid form data. Please check your inputs.", "danger")
            return redirect(url_for('signup'))
    return render_template('signup.html')

# ----- SIGNIN -----
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        try:
            email = request.form['email']
            password = request.form['password']

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            conn.close()

            print("User:", user)

            if user:
                print("Stored hash:", user['password'])
                print("Password match:", check_password_hash(user['password'], password))

            if user and check_password_hash(user['password'], password):
                session['email'] = user['email']
                session['role'] = user['role']
                session['user_id'] = user['id']

                print("Login successful")

                if user['role'] == 'student':
                    return redirect(url_for('student_dashboard'))
                elif user['role'] == 'brand':
                    return redirect(url_for('brand_dashboard'))

            flash("Invalid email or password.", "danger")
            return redirect(url_for('signin'))

        except Exception as e:
            print("Signin error:", e)
            flash("An error occurred during signin.", "danger")
            return redirect(url_for('signin'))

    return render_template('signin.html')

@app.route('/signout')
def signout():
    session.clear()  # Clears all session variables (logs user out)
    return redirect(url_for('landing'))  # Redirect to landing page


# ----- STUDENT PROFILE (create/update) -----
@app.route('/student-profile', methods=['GET', 'POST'])
def student_profile():
    if session.get('role') != 'student':
        return redirect(url_for('signin'))

    user_id = session['user_id']
    conn = get_db_connection()
    cursor = conn.cursor()

    if request.method == 'POST':
        full_name = request.form.get('full-name')
        phone = request.form.get('phone')
        dob = request.form.get('dob') or None
        bio = request.form.get('bio')
        institution = request.form.get('institution')
        program = request.form.get('program')
        major = request.form.get('major')
        year = request.form.get('year')
        student_id = request.form.get('student-id')
        # design_types (checkboxes) come as list, join to CSV string
        design_types = request.form.getlist('design-type')
        design_types_str = ','.join(design_types)
        other_designer_text = request.form.get('other-designer-text')
        materials = request.form.getlist('materials')
        materials_str = ','.join(materials)
        sustainability = request.form.get('sustainability')

        # Check if profile exists
        cursor.execute("SELECT * FROM student_profiles WHERE user_id = %s", (user_id,))
        existing = cursor.fetchone()

        if existing:
            # Update existing profile
            cursor.execute("""
                UPDATE student_profiles 
                SET full_name = %s, phone = %s, dob = %s, bio = %s,
                    institution = %s, program = %s, major = %s, year = %s,
                    student_id = %s, design_types = %s, other_designer_text = %s,
                    materials = %s, sustainability = %s
                WHERE user_id = %s
            """, (full_name, phone, dob, bio, institution, program, major, year,
                  student_id, design_types_str, other_designer_text, materials_str,
                  sustainability, user_id))
        else:
            # Create new profile
            cursor.execute("""
                INSERT INTO student_profiles 
                (user_id, full_name, phone, dob, bio, institution, program,
                 major, year, student_id, design_types, other_designer_text,
                 materials, sustainability)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (user_id, full_name, phone, dob, bio, institution, program,
                  major, year, student_id, design_types_str, other_designer_text,
                  materials_str, sustainability))

        conn.commit()
        conn.close()
        return redirect(url_for('student_dashboard'))

    # GET request - show profile form
    cursor.execute("SELECT * FROM student_profiles WHERE user_id = %s", (user_id,))
    profile = cursor.fetchone()
    conn.close()

    return render_template('stu-profile.html', profile=profile)

# ----- BRAND PROFILE (create/update) -----
@app.route('/brand-profile', methods=['GET', 'POST'])
def brand_profile():
    if session.get('role') != 'brand':
        return redirect(url_for('signin'))

    user_id = session['user_id']
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if profile exists first
    cursor.execute("SELECT * FROM brand_profiles WHERE user_id = %s", (user_id,))
    existing = cursor.fetchone()

    if request.method == 'POST':
        brand_name = request.form.get('brand-name')
        website = request.form.get('website')
        brand_bio = request.form.get('brand-bio')
        contact_name = request.form.get('contact-name')
        contact_email = request.form.get('contact-email')
        contact_phone = request.form.get('contact-phone')
        contact_role = request.form.get('contact-role')

        material_types = request.form.getlist('material-type')
        material_types_str = ','.join(material_types)

        material_quantities = request.form.get('material-description')
        shipping_method = request.form.get('shipping-method')
        shipping_notes = request.form.get('shipping-notes')

        # Handle logo upload
        logo_url = None
        if 'logo' in request.files:
            logo_url = save_uploaded_file(request.files['logo'], user_id)
            if not logo_url:
                logo_url = None
        elif existing:
            logo_url = existing['logo_url']

        if existing:
            cursor.execute("""
                UPDATE brand_profiles 
                SET brand_name = %s, website = %s, brand_bio = %s,
                    contact_name = %s, contact_email = %s, contact_phone = %s,
                    contact_role = %s, material_types = %s, material_quantities = %s,
                    shipping_method = %s, shipping_notes = %s, logo_url = %s
                WHERE user_id = %s
            """, (brand_name, website, brand_bio, contact_name, contact_email,
                  contact_phone, contact_role, material_types_str, material_quantities,
                  shipping_method, shipping_notes, logo_url, user_id))
        else:
            cursor.execute("""
                INSERT INTO brand_profiles 
                (user_id, brand_name, website, brand_bio, contact_name,
                 contact_email, contact_phone, contact_role, material_types,
                 material_quantities, shipping_method, shipping_notes, logo_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (user_id, brand_name, website, brand_bio, contact_name,
                  contact_email, contact_phone, contact_role, material_types_str,
                  material_quantities, shipping_method, shipping_notes, logo_url))

        conn.commit()
        conn.close()
        return redirect(url_for('brand_profile'))

    # GET request
    cursor.execute("SELECT * FROM brand_profiles WHERE user_id = %s", (user_id,))
    profile = cursor.fetchone()
    conn.close()

    return render_template('brands.html', profile=profile)

# ----- BRAND DASHBOARD -----
@app.route('/brand-dashboard')
def brand_dashboard():
    if session.get('role') != 'brand':
        return redirect(url_for('signin'))

    user_id = session['user_id']
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get brand profile
    cursor.execute("SELECT * FROM brand_profiles WHERE user_id = %s", (user_id,))
    profile = cursor.fetchone()
    
    # Get brand's inventory items
    if profile:
        cursor.execute("SELECT * FROM inventory WHERE brand_id = %s ORDER BY created_at DESC", (profile['id'],))
        inventory_items = cursor.fetchall()
        
        # Get pending requests count
        cursor.execute("SELECT COUNT(*) as count FROM material_requests WHERE brand_id = %s AND status = 'Pending'", (profile['id'],))
        pending_requests = cursor.fetchone()['count']
    else:
        inventory_items = []
        pending_requests = 0
    
    conn.close()
    
    if profile:
        brand_name = profile['brand_name']
    else:
        brand_name = "Brand"
    
    return render_template('brands.html', profile=profile, inventory_items=inventory_items, pending_requests=pending_requests, brand_name=brand_name)

# ----- STUDENT DASHBOARD -----
@app.route('/student-dashboard')
def student_dashboard():
    if session.get('role') == 'student':
        user_id = session['user_id']
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get student profile
        cursor.execute("SELECT full_name FROM student_profiles WHERE user_id = %s", (user_id,))
        profile = cursor.fetchone()
        
        # Get available inventory items
        cursor.execute("""
            SELECT i.*, bp.brand_name, bp.logo_url 
            FROM inventory i 
            JOIN brand_profiles bp ON i.brand_id = bp.id 
            WHERE i.status = 'available' 
            ORDER BY i.created_at DESC
        """)
        available_materials = cursor.fetchall()
        
        conn.close()
        
        if profile:
            name = profile['full_name']
        else:
            name = "Student"
        
        return render_template('student-dashboard.html', name=name, available_materials=available_materials)

    return redirect(url_for('signin'))

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')






@app.route('/add-material', methods=['GET', 'POST'])
def add_material():
    if session.get('role') != 'brand':
        return redirect(url_for('signin'))

    if request.method == 'POST':
        brand_user_id = session['user_id']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM brand_profiles WHERE user_id = %s", (brand_user_id,))
        brand = cursor.fetchone()

        if not brand:
            conn.close()
            return "Brand profile not found", 404

        brand_id = brand['id']

        material_name = request.form['material_name']
        material_type = request.form['material_type']
        quantity = int(request.form['quantity'])
        unit = request.form['unit']
        description = request.form['description']
        material_condition = request.form['material_condition']

        material_image = request.files.get('material_image')
        if material_image and material_image.filename != '':
            image_url = f"/static/uploads/{material_image.filename}"
            material_image.save(f"static/uploads/{material_image.filename}")
        else:
            image_url = None

        cursor.execute("""
            INSERT INTO inventory (
                brand_id, material_name, material_type, quantity, unit,
                description, material_condition, image_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            brand_id, material_name, material_type, quantity, unit,
            description, material_condition, image_url
        ))

        conn.commit()
        conn.close()

        return redirect(url_for('inventory'))

    return render_template('add-materials.html')

@app.route('/inventory')
def inventory():
    if session.get('role') != 'brand':
        return redirect(url_for('signin'))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM inventory ORDER BY created_at DESC")
    columns = [col[0] for col in cursor.description]
    results = cursor.fetchall()
    inventory_items = [dict(zip(columns, row)) for row in results]

    conn.close()
    
    return render_template('inventory.html', inventory_items=inventory_items)

@app.route('/request-material/<int:material_id>', methods=['GET', 'POST'])
def request_material(material_id):
    if 'student_id' not in session:
        return redirect('/student-login')
    cursor = mysql.connection.cursor(cursorclass=MySQLdb.cursors.DictCursor)


    # Get material details
    cursor.execute("SELECT * FROM inventory WHERE id = %s", (material_id,))
    material = cursor.fetchone()

    # Get brand_id from the material
    brand_id = material['brand_id']

    if request.method == 'POST':
        student_id = session.get('student_id')  # assuming student login is stored in session
        quantity = request.form['quantity']
        purpose = request.form['purpose']
        project_details = request.form['project-details']
        timeline = request.form['timeline']
        duration = request.form['duration']
        special_requests = request.form['special-requests']

        cursor.execute("""
            INSERT INTO material_requests (
                student_id, brand_id, material_id, quantity_requested,
                purpose, project_details, timeline, duration, special_requests
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            student_id, brand_id, material_id, quantity,
            purpose, project_details, timeline, duration, special_requests
        ))
        mysql.connection.commit()
        cursor.close()

        return redirect('/my-requests')
  # or show confirmation

    cursor.close()
    return render_template('request-material.html', material=material)


@app.route('/my-requests')
def my_requests():
    student_id = session.get('student_id')
    cursor = mysql.connection.cursor(cursorclass=MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT * FROM material_requests WHERE student_id = %s ORDER BY created_at DESC
    """, (student_id,))
    requests = cursor.fetchall()
    cursor.close()
    return render_template('my-requests.html', requests=requests)



@app.route('/brand/requests')
def brand_requests():
    brand_id = session.get('brand_id')
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    cursor.execute("""
        SELECT r.*, s.full_name as student_name, s.institution, 
               i.material_name as material_name, i.image_url
        FROM material_requests r
        JOIN student_profiles s ON r.student_id = s.id
        JOIN inventory i ON r.material_id = i.id
        WHERE r.brand_id = %s
        ORDER BY r.created_at DESC
    """, (brand_id,))
    
    requests = cursor.fetchall()
    cursor.close()
    return render_template('requests.html', requests=requests)


@app.route('/student-login')
def student_login_redirect():
    return redirect('/signin')



@app.route('/update-request-status', methods=['POST'])
def update_request_status():
    request_id = request.form.get('request_id')
    action = request.form.get('action')  # 'approve' or 'reject'

    new_status = 'Approved' if action == 'approve' else 'Rejected'

    cursor = mysql.connection.cursor()
    cursor.execute(
        "UPDATE material_requests SET status = %s WHERE id = %s",
        (new_status, request_id)
    )
    mysql.connection.commit()
    cursor.close()

    return redirect('/brand/requests')



@app.route('/generate-bio', methods=['POST'])
def generate_bio():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        design_style = data.get('design_style', '')
        skills = data.get('skills', [])
        purpose = data.get('purpose', '')

        prompt = f"""
        You are an AI assistant helping a fashion student write a professional design bio.
        Design Style: {design_style}
        Key Skills: {', '.join(skills)}
        Portfolio Purpose: {purpose}
        Write a short design bio (around 150 words) that is professional, clear, and inspiring.
        """

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        bio = response['choices'][0]['message']['content']
        return jsonify({"bio": bio})

    except Exception as e:
        import traceback
        traceback.print_exc()  # Prints detailed error in your terminal/console
        return jsonify({"error": str(e)}), 500

@app.route('/portfolio')
def portfolio():
    if 'user_id' not in session or session.get('role') != 'student':
        return redirect('/signin')
    return render_template('portfolio.html')


@app.route('/upload-project-images', methods=['POST'])
def upload_project_images():
    user_id = get_current_user_id()
    if user_id is None:
        return jsonify({"error": "User not logged in"}), 401

    uploaded_files = request.files.getlist("project_images")
    saved_files = []

    for file in uploaded_files:
        file_url = save_uploaded_file(file, user_id)
        if file_url:
            saved_files.append(file_url)

    if saved_files:
        return jsonify({"uploaded": True, "files": saved_files})
    else:
        return jsonify({"error": "No valid files uploaded"}), 400

    print("Incoming files keys:", request.files.keys())
    print("Incoming form keys:", request.form.keys())



@app.route('/join-challenge')
def join_challenge():
    return render_template('joinchallenge.html')


@app.route('/register-challenge')
def register_challenge():
    return render_template('registeredchallenge.html')


@app.route('/my-projects')
def my_projects():
    return render_template('myprojects.html')


@app.route('/materials')
def materials():
    return render_template('materials.html')    


@app.route('/track_order')
def track_order():
    return render_template('track-order.html')



# ----- LOGOUT -----
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

# ---------- RUN ----------
if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)
