package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.support.annotation.IdRes;
import android.text.InputFilter;
import android.text.Selection;
import android.text.SpanWatcher;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import static android.view.View.generateViewId;

/**
 * Created by David on 9/9/2017.
 */

public class PMR {
    String caption;
    String result;
    String repairString;
    EditText repairEditText;
    RadioButton pRadioButton;
    RadioButton mRadioButton;
    RadioButton rRadioButton;

    public PMR(){
    }
    public PMR(final TableLayout tableLayout, final TableRow tableRow, final TextView textView, final Context context, String caption, boolean isTablet, JSONObject itemsObject, int width, String note, String result){
        this.caption=caption;
        textView.setTag("incomplete");
        repairString=null;
        pRadioButton = new RadioButton(context);
        pRadioButton.setText("Present");
        if (isTablet) pRadioButton.setTextSize(25);
        pRadioButton.setId(generateViewId());
        final int pId=pRadioButton.getId();

        mRadioButton = new RadioButton(context);
        mRadioButton.setText("Missing");
        if (isTablet) mRadioButton.setTextSize(25);
        mRadioButton.setId(generateViewId());
        final int mId=mRadioButton.getId();

        rRadioButton = new RadioButton(context);
        rRadioButton.setText("Repairs Needed");
        if (isTablet) rRadioButton.setTextSize(25);
        rRadioButton.setId(generateViewId());
        final int rId=rRadioButton.getId();

        if(!isTablet) {
            FancyRadioGroup fancyRadioGroup = new FancyRadioGroup(context, tableRow, textView, pRadioButton, mRadioButton, rRadioButton);
        }
        else{
            FancyRadioGroupTablet fancyRadioGroupTablet = new FancyRadioGroupTablet(context, tableRow, textView, pRadioButton, mRadioButton, rRadioButton);
        }
        try {
            if (!itemsObject.isNull("prev")) {
                AddPrevResult.AddPrevPMR(tableLayout, itemsObject.getString("prev"), context, isTablet, width,0,note);
            }
        } catch (JSONException e) {
                e.printStackTrace();
        }
        final LinearLayout textLayout=new LinearLayout(context);
        textLayout.setOrientation(LinearLayout.HORIZONTAL);
        tableLayout.addView(textLayout);
        int index=tableLayout.indexOfChild(textLayout);
        textLayout.setTag("Text Row");
        textLayout.setVisibility(View.INVISIBLE);

        final TextView labelText = new TextView(context);
        labelText.setText("");
        if(isTablet) labelText.setTextSize(25);
        textLayout.addView(labelText);

        repairEditText = new EditText(context);
        //if(isTablet) repairEditText.setTextSize(30);
        //repairEditText.setEnabled(false);
        //repairEditText.setVisibility(View.INVISIBLE);
        //repairEditText.setText("");
        textLayout.addView(repairEditText);
        //if(isTablet) repairEditText.setTextSize(30);
        textLayout.setVisibility(View.GONE);

        final String prefix="Notes: ";
        pRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mRadioButton.setChecked(false);
                rRadioButton.setChecked(false);
                /*if (repairEditText.isEnabled()){
                    repairEditText.setEnabled(false);
                    repairEditText.setVisibility(View.INVISIBLE);
                    labelText.setText("");
                }*/
                textView.setTag("Present");
                textLayout.setVisibility(View.GONE);
                System.out.println("p button got clicked");
                //tableLayout.removeView(textLayout);
            }
        });
        mRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                pRadioButton.setChecked(false);
                rRadioButton.setChecked(false);
                /*if (repairEditText.isEnabled()){
                    repairEditText.setEnabled(false);
                    repairEditText.setVisibility(View.INVISIBLE);
                    labelText.setText("");
                }*/
                /*if (repairEditText.isEnabled()){
                    repairEditText.setEnabled(false);
                    repairEditText.setVisibility(View.INVISIBLE);
                    labelText.setText("");
                }*/
                //repairEditText.setEnabled(true);
                //repairEditText.setVisibility(View.VISIBLE);
                repairEditText.requestFocus();
                labelText.setText(prefix);
                /*if (textLayout.getVisibility()==View.VISIBLE){
                    textLayout.setVisibility(View.INVISIBLE);
                    tableLayout.removeView(textLayout);
                }*/
                textLayout.setVisibility(View.VISIBLE);
                //tableLayout.addView(textLayout,index);
                textView.setTag("Missing");
            }
        });
        rRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mRadioButton.setChecked(false);
                pRadioButton.setChecked(false);
                /*if (repairEditText.isEnabled()){
                    repairEditText.setEnabled(false);
                    repairEditText.setVisibility(View.INVISIBLE);
                    labelText.setText("");
                }
                repairEditText.setEnabled(true);
                repairEditText.setVisibility(View.VISIBLE);*/
                repairEditText.requestFocus();
                labelText.setText(prefix);
                textView.setTag("Repairs Needed");
                /*if (textLayout.getVisibility()==View.VISIBLE){
                    textLayout.setVisibility(View.INVISIBLE);
                    tableLayout.removeView(textLayout);
                }*/
                textLayout.setVisibility(View.VISIBLE);
                //tableLayout.addView(textLayout,index);
            }
        });
        if(isTablet) repairEditText.setTextSize(25);
        System.out.println("parsing, in PMR, about to click");
        if (result!=null){
            System.out.println("parsing, in PMR, result is " + result);
            if (result.compareTo("Repairs Needed")==0){
                rRadioButton.performClick();
                repairEditText.setText(note);
            }
            else if (result.compareTo("Missing")==0){
                mRadioButton.performClick();
                if (note!=null)
                    repairEditText.setText(note);
            }
            else if (result.compareTo("Present")==0){
                System.out.println("it was present");
                pRadioButton.performClick();
            }
        }
    }
}
